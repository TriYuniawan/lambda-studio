"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { FEATURED_STYLES } from "@/lib/constants";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        2. Select Style
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {FEATURED_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onStyleSelect(style)}
            className={`p-3 rounded-xl border text-sm font-medium transition-all ${
              selectedStyle === style
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </section>
  );
}
