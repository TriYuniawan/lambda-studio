import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HERO_VIDEO_SRC } from "@/lib/constants";

export function HomeHeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-68px)] py-16 overflow-hidden">
      {/* Background Video & Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-background/50 dark:bg-background/80 bg-linear-to-b from-background/40 to-background/90 z-10" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
          <span className="block mb-2">High-fidelity style transfer.</span>
          <span className="block text-2xl md:text-4xl font-medium text-foreground/80 mt-4">
            One upload, a gallery-ready image.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl">
          Upload once, pick a curated style, get a polished restyle.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Show when="signed-out">
            <SignUpButton mode="modal" fallbackRedirectUrl="/studio">
              <Button
                size="lg"
                className="text-base px-8 h-12 rounded-full shadow-lg cursor-pointer"
              >
                Get Started Free
              </Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Button
              size="lg"
              asChild
              className="text-base px-8 h-12 rounded-full shadow-lg cursor-pointer"
            >
              <Link href="/studio" prefetch={false}>
                Open Studio
              </Link>
            </Button>
          </Show>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-base px-8 h-12 rounded-full border-primary/20 hover:bg-primary/5 dark:bg-black/40 backdrop-blur-sm cursor-pointer"
          >
            <a href="#how-it-works">Watch 2min demo</a>
          </Button>
        </div>

        {/* Demo Interface Image */}
        <div
          id="how-it-works"
          className="w-full max-w-5xl relative group perspective-1000"
        >
          <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-primary/10 transition-transform duration-700 ease-out hover:scale-[1.02]">
            <Image
              src="/demo2.png"
              alt="Lambda Studio workspace showing upload, curated styles, and a before-and-after preview"
              width={3290}
              height={1872}
              className="h-auto w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
