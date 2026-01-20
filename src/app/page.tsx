"use client";

import { FormEvent, useState } from "react";
import { useCheckout, useProducts } from "@moneydevkit/nextjs";

const MAX_PROMPT_LENGTH = 400;

export default function Home() {
  const { createCheckout, isLoading } = useCheckout();
  const { products } = useProducts();
  const [prompt, setPrompt] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products?.find((p) => p.id === selectedProductId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please describe the image you want to generate.");
      return;
    }

    if (!selectedProductId) {
      setError("Please select an image option.");
      return;
    }

    setError(null);

    const result = await createCheckout({
      type: "PRODUCTS",
      product: selectedProductId,
      successUrl: `/success?prompt=${encodeURIComponent(trimmedPrompt)}`,
      requireCustomerData: ["email"],
      metadata: {
        prompt: trimmedPrompt,
      },
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    window.location.href = result.data.checkoutUrl;
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

            <fieldset className="space-y-3">
              <legend className="block text-sm font-medium text-slate-700">
                Choose an option
              </legend>
              {!products ? (
                <p className="text-sm text-slate-500">Loading options…</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-slate-500">No products available.</p>
              ) : (
                <div className="grid gap-3">
                  {products.map((product) => {
                    const price = product.prices[0];
                    const isSelected = selectedProductId === product.id;
                    return (
                      <label
                        key={product.id}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-3 transition ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="product"
                            value={product.id}
                            checked={isSelected}
                            onChange={() => setSelectedProductId(product.id)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-slate-500">{product.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">
                          {price?.amountType === "CUSTOM"
                            ? "Pay what you want"
                            : `$${((price?.priceAmount ?? 0) / 100).toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !selectedProductId}
              className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading
                ? "Creating checkout…"
                : selectedProduct
                  ? `Continue to checkout – $${((selectedProduct.prices[0]?.priceAmount ?? 0) / 100).toFixed(2)}`
                  : "Select an option"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
