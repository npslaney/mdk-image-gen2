"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_PROMPT_LENGTH = 400;

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please describe the image you want to generate.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to generate an image.");
      }

      router.push(
        `/success?image=${encodeURIComponent(payload.imageUrl)}&prompt=${encodeURIComponent(
          trimmedPrompt,
        )}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error while generating.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-10 px-4 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Prompt-to-Checkout Prototype
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Describe the image you want
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block text-sm font-medium text-slate-700" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={5}
              maxLength={MAX_PROMPT_LENGTH}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="A dreamy watercolor illustration of a vintage camera floating among clouds..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{MAX_PROMPT_LENGTH - prompt.length} characters remaining</span>
              <span>Powered by OpenAI Images</span>
            </div>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? "Generating image…" : "Generate & continue to checkout"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
