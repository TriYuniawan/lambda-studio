import { HomeHeroSection } from "@/components/ui/HeroSection";
import GalleryShowcaseSection from "@/components/GalleryShowcaseSection";
import { HowItWorksSection } from "@/components/HowItWorks";
import { PricingSection } from "@/components/Pricing";
import { TestimonialsSection } from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background">
      <HomeHeroSection />
      <GalleryShowcaseSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
    </main>
  );
}
