"use client";

import React from "react";
import { Download, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GenerationDisplayProps {
  uploadedImage: string | null;
  resultImage: string | null;
  isGenerating: boolean;
  onReset: () => void;
}

export function GenerationDisplay({
  uploadedImage,
  resultImage,
  isGenerating,
  onReset,
}: GenerationDisplayProps) {
  return (
    <div className="lg:col-span-8 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-primary" />
        Preview & Result
      </h2>
      <Card className="flex-1 bg-card/50 border-none overflow-hidden relative min-h-[500px] flex items-center justify-center">
        {!uploadedImage && !resultImage ? (
          <div className="text-center space-y-4 opacity-50">
            <div className="relative mx-auto w-24 h-24">
              <ImageIcon className="w-full h-full text-muted-foreground" />
            </div>
            <p className="text-lg">Your creation will appear here</p>
          </div>
        ) : (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {/* Before */}
            <div className="relative bg-background flex flex-col items-center justify-center p-4">
              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                SOURCE
              </div>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Source"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>
            {/* After */}
            <div className="relative bg-background flex flex-col items-center justify-center p-4">
              <div className="absolute top-4 left-4 z-10 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                RESULT
              </div>
              {resultImage ? (
                <img
                  src={resultImage}
                  alt="Result"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-700"
                />
              ) : isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 space-y-4">
                  <div className="relative">
                    <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                  </div>
                  <p className="text-sm font-medium text-primary animate-pulse tracking-wide">
                    MAGICAL TRANSFORM...
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card/20">
                  <p className="text-muted-foreground text-sm italic">
                    Click generate to see the magic
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {resultImage && !isGenerating && (
          <div className="absolute bottom-6 right-6 flex gap-3 animate-in slide-in-from-bottom-4 duration-500">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full shadow-lg border-primary/20"
              onClick={onReset}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="lg" className="rounded-full shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
