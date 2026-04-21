"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURED_STYLES } from "@/lib/constants";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleSelector } from "@/components/StyleSelector";
import { GenerationDisplay } from "@/components/GenerationDisplay";

export default function StudioPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>(FEATURED_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ url: string; style: string }[]>([]);

  const handleGenerate = async () => {
    if (!uploadedFile) return;
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
        throw new Error(data.error || "Failed to generate");
      }

      setResultImage(data.result);
      setHistory((prev) => [{ url: data.result, style: selectedStyle }, ...prev]);
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
              disabled={!uploadedImage || isGenerating}
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

            {/* History Section */}
            {history.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Recent Generations
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative min-w-[120px] aspect-square rounded-xl overflow-hidden border border-border group cursor-pointer"
                      onClick={() => setResultImage(item.url)}
                    >
                      <img src={item.url} alt="History" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.style}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}