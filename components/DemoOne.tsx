import { Footer2 } from "@/components/ui/footer-2";

export default function DemoOne() {
   return (
    <div className="w-full">
      <div className="w-full relative flex min-h-[calc(100vh-20rem)] h-full items-center">
        {/* Subtle dotted grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 0.8px, transparent 0.8px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient( circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70% )",
          }}
        />
      </div>

      <Footer2 />
    </div>
  );
}
