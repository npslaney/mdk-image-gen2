"use client";

import { use } from "react";

import { Checkout } from "@moneydevkit/nextjs";

type CheckoutPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = use(params);

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
        <Checkout id={id} />
      </div>
    </div>
  );
}


