## Prompt-to-Checkout Demo

A Next.js 16 + Tailwind App Router experience that:

- Captures an image prompt on `/`
- Calls OpenAI’s Image API on `/api/generate`
- (Future) Redirects the customer through a payments checkout flow
- Displays the generated art on `/success` as if payment succeeded

Use this project as the foundation for wiring in a real checkout provider (Stripe, Lemon Squeezy, Paddle, etc.) that eventually redirects customers back to `/success`.

## Prerequisites

- Node.js 18.18+ or 20.0+
- An OpenAI API key with access to `gpt-image-1`

## Environment Variables

Create a `.env.local` file (never commit it) and populate:

```
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` is optional, but helps when the site is deployed on Vercel and client-side fetches need an absolute origin.

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and enter a prompt. Once the serverless route returns an image URL, the app simulates a completed checkout by jumping straight to `/success`.

## How It Works

| Path | Purpose |
| ---- | ------- |
| `src/app/page.tsx` | Client component with prompt form, validation, and POST request to `/api/generate`. |
| `src/app/api/generate/route.ts` | Server route that calls `openai.images.generate` and returns the image URL. |
| `src/app/success/page.tsx` | Displays the generated image & prompt as if a checkout library redirected back here post-payment. |

Drop your real checkout page between the prompt form and success redirect—e.g., send the prompt to your backend, create a Checkout Session, and have the provider redirect to `/success?image=...`.

## Deployment on Vercel

1. Push this repository to GitHub (private is fine).
2. Create a new Vercel project, selecting this repo.
3. Set the following Environment Variables in Vercel →
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app`
4. Deploy. Vercel will install dependencies, build, and host the App Router project automatically.

> ℹ️ If your real checkout provider supplies webhooks, be sure to persist the OpenAI response (image URL) alongside the order and only redirect to `/success` once payment events confirm.
