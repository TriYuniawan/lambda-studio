import { NextResponse } from "next/server";

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

// ============================================================
// Model Config
// ============================================================
// sourceful/riverflow-v2-fast → FREE, supports image-to-image, fast
// sourceful/riverflow-v2-pro  → FREE, supports image-to-image, higher quality
// Both confirmed free via OpenRouter Models API (pricing: prompt $0, completion $0)
// Source: https://openrouter.ai/api/v1/models?output_modalities=image
const OPENROUTER_MODEL = "sourceful/riverflow-v2-fast";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ============================================================
// Helper: Upload image to imgbb (free, no account needed with API key)
// imgbb free API: https://api.imgbb.com/
// Get free API key at: https://imgbb.com/upload -> API
// ============================================================
async function uploadImageToImgbb(
  imageBytes: ArrayBuffer,
  imageType: string,
  apiKey: string,
): Promise<string> {
  const base64 = Buffer.from(imageBytes).toString("base64");

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(
      `imgbb upload failed: ${err?.error?.message ?? res.statusText}`,
    );
  }

  const data = await res.json();
  return data.data.url as string;
}

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

    // --- 2. Validate env vars ---
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured." },
        { status: 500 },
      );
    }

    if (!IMGBB_API_KEY) {
      return NextResponse.json(
        { error: "imgbb API key not configured." },
        { status: 500 },
      );
    }

    // --- 3. Build prompt ---
    const styleDescription =
      STYLE_PROMPTS[style] ??
      `Restyle this image into ${style}. Keep the subject identity and composition the same.`;
    const prompt = `Restyle this image into: ${styleDescription}. Keep the subject identity and composition the same.`;

    // --- 4. Upload image to imgbb to get a public URL ---
    // Sourceful models strongly recommend URLs over base64 due to 4.5MB request limit
    const imageBytes = await image.arrayBuffer();
    const imageUrl = await uploadImageToImgbb(
      imageBytes,
      image.type || "image/png",
      IMGBB_API_KEY,
    );

    // --- 5. Call OpenRouter with Riverflow V2 Fast (free img2img model) ---
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Lambda Studio",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        // Sourceful/Riverflow only outputs images (no text)
        modalities: ["image"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl, // Public URL — avoids 4.5MB base64 limit
                },
              },
            ],
          },
        ],
      }),
    });

    // --- 6. Handle non-OK response ---
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenRouter Error:", errorData || response.statusText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid or missing OpenRouter API key." },
          { status: 401 },
        );
      }
      if (response.status === 402) {
        return NextResponse.json(
          { error: "OpenRouter credits exhausted. Please check your account." },
          { status: 402 },
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit reached. Please wait a moment and try again." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          error:
            errorData?.error?.message ??
            `Failed to generate image (${response.status}).`,
        },
        { status: response.status },
      );
    }

    // --- 7. Extract generated image ---
    // OpenRouter Sourceful models return images in:
    // choices[0].message.images[].imageUrl.url  (base64 data URL)
    const data = await response.json();
    console.log("OpenRouter Response:", JSON.stringify(data, null, 2));

    const message = data.choices?.[0]?.message;
    const generatedImageUrl =
      message?.images?.[0]?.imageUrl?.url ??
      message?.images?.[0]?.url ??
      // fallback: some models embed base64 directly in content
      (typeof message?.content === "string" &&
      message.content.startsWith("data:")
        ? message.content
        : null);

    if (!generatedImageUrl) {
      console.error("Unexpected response structure:", JSON.stringify(data));
      return NextResponse.json(
        { error: "No image was generated. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ result: generatedImageUrl });
  } catch (error: unknown) {
    console.error("API Route Error:", error);

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("imgbb")) {
        return NextResponse.json(
          { error: "Failed to upload input image. Please try again." },
          { status: 500 },
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
