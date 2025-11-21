"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckoutSuccess } from "@moneydevkit/nextjs";
import { useEffect, useState, Suspense } from "react";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCheckoutPaidLoading, isCheckoutPaid, metadata } = useCheckoutSuccess();
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get prompt from URL or metadata
  const prompt = searchParams.get("prompt")?.trim() || (metadata?.prompt as string | undefined)?.trim();

  // Redirect if no prompt
  useEffect(() => {
    if (!prompt) {
      router.push("/");
    }
  }, [prompt, router]);

  // Generate image in the background (non-blocking)
  useEffect(() => {
    if (!prompt || !isCheckoutPaid) return;

    const generateImage = async () => {
      setIsGenerating(true);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (error) {
        setGenerationError(
          error instanceof Error ? error.message : "Unable to generate the image."
        );
      } finally {
        setIsGenerating(false);
      }
    };

    generateImage();
  }, [prompt, isCheckoutPaid]);

  if (!prompt) {
    return null; // Will redirect via useEffect
  }

  // Show verification loading state
  if (isCheckoutPaidLoading || isCheckoutPaid === null) {
    return (
      <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-lg font-medium text-slate-700">Verifying payment…</p>
          </div>
        </div>
      </div>
    );
  }

  // Show payment not confirmed
  if (!isCheckoutPaid) {
    return (
      <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <header className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-600">Error</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Payment not confirmed
            </h1>
            <p className="text-slate-600">
              Your payment could not be verified. Please contact support if you believe this is an error.
            </p>
          </header>
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Payment confirmed - show success
  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">Success</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Payment confirmed — your artwork is {isGenerating ? "generating" : "ready"}
          </h1>
        </header>

        <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prompt recap</h2>
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{prompt}</p>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Generate another image
            </Link>
          </div>

          {generationError ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-6 text-center text-red-700">
              <p className="text-base font-semibold">Image generation failed</p>
              <p className="text-sm text-red-600">{generationError}</p>
              <p className="mt-3 text-xs text-red-500">
                Try again or contact support if the issue persists.
              </p>
            </div>
          ) : (
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-100">
              {isGenerating && !imageUrl ? (
                <div className="flex h-full flex-col items-center justify-center space-y-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                  <p className="text-sm font-medium text-slate-700">Generating your image…</p>
                </div>
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Generated artwork for: ${prompt}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="text-lg font-medium text-slate-700">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}

