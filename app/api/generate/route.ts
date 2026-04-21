import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;

    if (!image || !style) {
      return NextResponse.json(
        { error: "Image and style are required." },
        { status: 400 }
      );
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPEN_AI_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API Key not configured." },
        { status: 500 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const imageDataUrl = `data:${image.type};base64,${base64Image}`;

    // Prompt mapping
    const stylePrompts: Record<string, string> = {
      "Storybook 3D": "3D storybook illustration style, charming, whimsical, high quality 3D render, soft colors.",
      "Anime Cel": "High quality anime cel style, 2D hand-drawn look, vibrant colors, clean lines.",
      "Clay Render": "Clay render style, stop motion look, soft studio lighting, tactile clay texture, handcrafted feel.",
      "Pixart": "Modern 3D animated movie style, expressive characters, highly detailed, cinematic lighting, Pixar-inspired.",
    };

    const prompt = `Restyle the following image into ${stylePrompts[style] || style}. Keep the subject identity and composition the same. Output ONLY the resulting image.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lambda-studio.vercel.app", // Optional
        "X-Title": "Lambda Studio", // Optional
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux.1-schnell", // Default model
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
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to generate image." },
        { status: response.status }
      );
    }

    // OpenRouter returns generated images in the response body if modalities: ["image"] is used
    // Note: The structure might vary, but usually it's in data.choices[0].message.content or a separate images array
    const resultImageUrl = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.images?.[0];

    if (!resultImageUrl) {
        return NextResponse.json({ error: "No image generated." }, { status: 500 });
    }

    return NextResponse.json({ result: resultImageUrl });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
