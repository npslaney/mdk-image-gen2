import { getOpenAIClient } from "./openai";

export const generateImageForPrompt = async (prompt: string) => {
  const client = getOpenAIClient();

  const response = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const { url, b64_json: base64 } = response.data?.[0] ?? {};
  const imageUrl = url ?? (base64 ? `data:image/png;base64,${base64}` : undefined);

  if (!imageUrl) {
    throw new Error("The image API did not return a URL.");
  }

  return imageUrl;
};

