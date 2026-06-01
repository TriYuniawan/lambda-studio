"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw, Coins, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURED_STYLES } from "@/lib/constants";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleSelector } from "@/components/StyleSelector";
import { GenerationDisplay } from "@/components/GenerationDisplay";

// ============================================================
// Types
// ============================================================
interface HistoryItem {
  id: string;
  style: string;
  originalImage: string;
  resultImage: string;
  cost: number;
  createdAt: string;
}

// ============================================================
// Studio Page
// ============================================================
export default function StudioPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>(FEATURED_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // Database-backed state
  const [credits, setCredits] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // --- Fetch credits dari API ---
  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setIsLoadingCredits(false);
    }
  }, []);

  // --- Fetch history dari API ---
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.generations);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // --- Load credits dan history saat halaman dimuat ---
  useEffect(() => {
    fetchCredits();
    fetchHistory();
  }, [fetchCredits, fetchHistory]);

  // --- Handle generate ---
  const handleGenerate = async () => {
    if (!uploadedFile) return;

    // Cek kredit sebelum request ke server
    if (credits !== null && credits < 5) {
      alert("Insufficient credits! You need at least 5 credits to generate.");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("style", selectedStyle);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle insufficient credits error dari server
        if (response.status === 402 || data.code === "INSUFFICIENT_CREDITS") {
          alert(data.error || "Insufficient credits. Please top up!");
          return;
        }
        throw new Error(data.error || "Failed to generate");
      }

      setResultImage(data.result);

      // Update kredit dari response
      if (data.creditsRemaining !== undefined) {
        setCredits(data.creditsRemaining);
      }

      // Refresh history dari database
      fetchHistory();
    } catch (error) {
      console.error("Generation Error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (imageUrl: string, file: File) => {
    setUploadedImage(imageUrl);
    setUploadedFile(file);
    setResultImage(null);
  };

  const handleReset = () => {
    setResultImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        {/* Credit Balance Bar */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Credits</p>
              <p className="text-2xl font-bold tracking-tight">
                {isLoadingCredits ? (
                  <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <>
                    {credits ?? 0}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                      tokens
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          {credits !== null && credits < 5 && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>Low balance — top up to continue</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-8">
            <ImageUpload onImageSelect={handleImageSelect} />
            
            <StyleSelector 
              selectedStyle={selectedStyle} 
              onStyleSelect={setSelectedStyle} 
            />

            <Button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating || (credits !== null && credits < 5)}
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Magic
                  <span className="ml-1 text-xs font-normal opacity-70">
                    (5 credits)
                  </span>
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Preview & Result */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            <GenerationDisplay 
              uploadedImage={uploadedImage}
              resultImage={resultImage}
              isGenerating={isGenerating}
              onReset={handleReset}
            />

            {/* History Section — dari Database */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Recent Generations
              </h2>
              {isLoadingHistory ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[120px] aspect-square rounded-xl bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No generations yet. Upload an image and create your first one!
                </p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative min-w-[120px] aspect-square rounded-xl overflow-hidden border border-border group cursor-pointer"
                      onClick={() => setResultImage(item.resultImage)}
                    >
                      <img src={item.resultImage} alt="History" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.style}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}