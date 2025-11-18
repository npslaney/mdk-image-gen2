import { NextResponse } from "next/server";
import { generateImageForPrompt } from "@/lib/generate-image";

type GenerateRequest = {
  prompt?: string;
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
    const imageUrl = await generateImageForPrompt(prompt);

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

