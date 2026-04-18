"use client";

import { Show, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GALLERY_IMAGES, SHOWCASE_BG_VIDEO_SRC } from "@/lib/constants";

const GalleryShowcaseSection = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-zinc-950">
      {/* Background Video layer */}
      <div className="absolute inset-0 z-0">
        <video
          src={SHOWCASE_BG_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            Endless <span className="text-zinc-400">Possibilities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400"
          >
            Explore incredible AI-generated art styles. Transform your ideas
            into stunning visuals with just a few clicks.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 shadow-xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white font-semibold text-lg leading-tight">
                  {img.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="text-base px-8 h-12 rounded-full shadow-lg cursor-pointer"
              >
                Get Started Free
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/studio">
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 text-base font-medium h-12"
              >
                Go to Studio
              </Button>
            </Link>
          </Show>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryShowcaseSection;
