"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelect(url, file);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        1. Upload Source
      </h2>
      <label className="block">
        <Card className="p-6 border-dashed border-2 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium">Click to upload image</p>
          <p className="text-sm text-muted-foreground mt-1">
            JPG, PNG, WebP (Max 5MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Card>
      </label>
    </section>
  );
}
