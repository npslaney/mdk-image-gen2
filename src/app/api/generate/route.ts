import { NextResponse } from "next/server";
import OpenAI from "openai";

type GenerateRequest = {
  prompt?: string;
};

let cachedClient: OpenAI | null = null;

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
};

export async function POST(request: Request) {
  let payload: GenerateRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const prompt = payload.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const client = getOpenAIClient();

    const imageResponse = await client.images.generate({
      model: "dall-e-2",
      prompt,
      size: "1024x1024",
    });

    const { url, b64_json: base64 } = imageResponse.data?.[0] ?? {};
    const imageUrl = url ?? (base64 ? `data:image/png;base64,${base64}` : undefined);

    if (!imageUrl) {
      throw new Error("The image API did not return a URL.");
    }

    return NextResponse.json({
      imageUrl,
      prompt,
      note: "Replace this step with your payment processor before revealing the art.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    const status = message.includes("API key") ? 500 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}

