import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type SuccessPageProps = {
  searchParams: Promise<{
    image?: string;
    prompt?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const imageUrl = resolvedSearchParams.image;
  const prompt = resolvedSearchParams.prompt ?? "Unknown prompt";

  if (!imageUrl) {
    redirect("/");
  }

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">Success</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Payment confirmed — your artwork is ready
          </h1>
          <p className="text-base text-slate-600">
            In production, your payments provider will land customers on this page after checkout.
            For now, we skip straight here once OpenAI finishes generating an image.
          </p>
        </header>

        <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prompt recap</h2>
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{prompt}</p>
            <div className="space-y-2 text-sm text-slate-500">
              <p>Next steps:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Persist the image URL in your database/order record.</li>
                <li>Send fulfillment emails or webhooks after checkout.</li>
                <li>Optionally provide download limits or expiry.</li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Generate another image
            </Link>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-100">
            <Image
              src={imageUrl}
              alt={`Generated artwork for: ${prompt}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </section>
      </div>
    </div>
  );
}

