import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ============================================================
// Style Prompt Mapping
// ============================================================
const STYLE_PROMPTS: Record<string, string> = {
  "Storybook 3D":
    "3D storybook illustration style, charming, whimsical, high quality 3D render, soft colors, soft lighting, cinematic depth",
  "Anime Cel":
    "High quality anime cel style, 2D hand-drawn look, vibrant colors, clean lines, expressive characters",
  "Clay Render":
    "Clay render style, stop motion look, soft studio lighting, tactile clay texture, handcrafted feel, claymation",
  Pixart:
    "Modern 3D animated movie style, expressive characters, highly detailed, cinematic lighting, Pixar-inspired",
};

// ============================================================
// Hugging Face Inference API Configuration
// ============================================================
const HF_MODEL = "black-forest-labs/FLUX.1-schnell";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

// ============================================================
// OpenRouter Configuration (DISABLED — no credits, kept for reference)
// ============================================================
// const OPENROUTER_MODELS = ["sourceful/riverflow-v2-fast", "sourceful/riverflow-v2-pro"];
// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
//
// async function generateWithOpenRouter(imageUrl: string, prompt: string, apiKey: string): Promise<string> {
//   for (const model of OPENROUTER_MODELS) {
//     const res = await fetch(OPENROUTER_API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
//         "X-Title": "Lambda Studio",
//       },
//       body: JSON.stringify({
//         model,
//         modalities: ["image"],
//         messages: [
//           {
//             role: "user",
//             content: [
//               { type: "text", text: prompt },
//               { type: "image_url", image_url: { url: imageUrl } },
//             ],
//           },
//         ],
//       }),
//     });
//     if (!res.ok) continue;
//     const data = await res.json();
//     const message = data.choices?.[0]?.message;
//     const image =
//       message?.images?.[0]?.imageUrl?.url ??
//       message?.images?.[0]?.url ??
//       (typeof message?.content === "string" && message.content.startsWith("data:") ? message.content : null);
//     if (image) return image;
//   }
//   throw new Error("All OpenRouter models failed");
// }

// ============================================================
// POST Handler
// ============================================================
export async function POST(req: Request) {
  try {
    // --- 1. Parse & validate form data ---
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const style = formData.get("style") as string | null;

    if (!image || !style) {
      return NextResponse.json(
        { error: "Image and style are required." },
        { status: 400 },
      );
    }

    // Validate file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 5MB)." },
        { status: 400 },
      );
    }

    // --- 2. Validate HF token ---
    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) {
      return NextResponse.json(
        { error: "Hugging Face API Token not configured." },
        { status: 500 },
      );
    }

    // --- 3. Build prompt ---
    const styleDescription = STYLE_PROMPTS[style] ?? style;
    const prompt = `Create an image in ${styleDescription}. High quality, detailed, professional artwork.`;

    // --- 4. Call Hugging Face FLUX.1-schnell (text-to-image) ---
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch(HF_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    clearTimeout(timeout);

    // --- 5. Handle errors ---
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Hugging Face Error:", errorData || response.statusText);

      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading, please try again in 20-30 seconds." },
          { status: 503 },
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit reached. Please wait a moment and try again." },
          { status: 429 },
        );
      }
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid or missing Hugging Face API token." },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          error:
            errorData?.error ||
            `Failed to generate image (${response.status}).`,
        },
        { status: response.status },
      );
    }

    // --- 6. Convert binary response to base64 data URL ---
    // FLUX.1-schnell returns raw image bytes (JPEG)
    const imageBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(imageBuffer).toString("base64");

    if (!resultBase64 || resultBase64.length < 100) {
      return NextResponse.json(
        { error: "No image was generated. Please try again." },
        { status: 500 },
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const resultImageUrl = `data:${contentType};base64,${resultBase64}`;

    return NextResponse.json({ result: resultImageUrl });
  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Generation timed out. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
