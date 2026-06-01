import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

// ============================================================
// Style Prompt Mapping
// ============================================================
const STYLE_PROMPTS: Record<string, string> = {
  "Storybook 3D":
    "3D storybook illustration style, charming, whimsical, high quality 3D render, soft colors.",
  "Anime Cel":
    "High quality anime cel style, 2D hand-drawn look, vibrant colors, clean lines.",
  "Clay Render":
    "Clay render style, stop motion look, soft studio lighting, tactile clay texture, handcrafted feel.",
  Pixart:
    "Modern 3D animated movie style, expressive characters, highly detailed, cinematic lighting, Pixar-inspired.",
};

// tencent/HunyuanImage-3.0-Instruct is the official fal-ai image-to-image model
// Source: https://huggingface.co/docs/inference-providers/en/providers/fal-ai
const HF_MODEL = "tencent/HunyuanImage-3.0-Instruct";

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

    // --- 2. Validate HF token ---
    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) {
      return NextResponse.json(
        { error: "Hugging Face API Token not configured." },
        { status: 500 },
      );
    }

    // --- 3. Build prompt ---
    const styleDescription =
      STYLE_PROMPTS[style] ??
      `Restyle this image into ${style}. Keep the subject identity and composition the same.`;
    const prompt = `Restyle this image into: ${styleDescription}. Keep the subject identity and composition the same.`;

    // --- 4. Convert image File → raw bytes (required by InferenceClient img2img) ---
    const imageBytes = await image.arrayBuffer();

    // --- 5. Call HuggingFace via InferenceClient (fal-ai provider) ---
    // Model: tencent/HunyuanImage-3.0-Instruct
    // → officially supported for image-to-image task on fal-ai provider
    const client = new InferenceClient(HF_API_TOKEN);

    const resultBlob = await client.imageToImage({
      model: HF_MODEL,
      provider: "fal-ai",
      inputs: new Blob([imageBytes], { type: image.type || "image/png" }),
      parameters: {
        prompt,
      },
    });

    // --- 6. Convert result Blob → base64 data URL ---
    const resultBuffer = await resultBlob.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString("base64");

    if (!resultBase64 || resultBase64.length < 100) {
      return NextResponse.json(
        { error: "No image was generated. Please try again." },
        { status: 500 },
      );
    }

    const contentType = resultBlob.type || "image/png";
    const resultImageUrl = `data:${contentType};base64,${resultBase64}`;

    return NextResponse.json({ result: resultImageUrl });
  } catch (error: unknown) {
    console.error("API Route Error:", error);

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("loading") || msg.includes("503")) {
        return NextResponse.json(
          { error: "Model is loading, please try again in 20–30 seconds." },
          { status: 503 },
        );
      }

      if (msg.includes("429") || msg.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit reached. Please wait a moment and try again." },
          { status: 429 },
        );
      }

      if (msg.includes("401") || msg.includes("unauthorized")) {
        return NextResponse.json(
          { error: "Invalid or missing Hugging Face API token." },
          { status: 401 },
        );
      }

      if (msg.includes("402") || msg.includes("credits")) {
        return NextResponse.json(
          {
            error:
              "Monthly free credits exhausted. Upgrade to HF PRO for more.",
          },
          { status: 402 },
        );
      }

      if (
        msg.includes("no inference provider") ||
        msg.includes("not supported")
      ) {
        return NextResponse.json(
          {
            error:
              "Model not supported by this provider. Check HF inference provider settings.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: error.message || "Internal server error." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
