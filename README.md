# NIVORA ESSENTIALS

Premium everyday essentials for men, women, and kids.

**Brand line:** Comfort for Every Body.

## Brand direction
- Primary identity: charcoal and warm ivory, with a refined serif wordmark and signature V detail.
- Website themes: persistent light and dark modes.
- Intro: cinematic NIVORA wordmark reveal with a skip control.
- Audience: men, women, and kids.
- Retail and wholesale will share a catalogue, with separate pricing and minimum order quantities.

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (database, authentication, image storage)
- Resend (order notifications)
- Vercel (deployment)

## Local development
1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in credentials when services are configured.
4. Run `npm run dev` and open http://localhost:3000.

## Environment variables
See `.env.example`. Never commit real credentials. Keep `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` server-side only.

## Current scope
The initial foundation includes the responsive brand homepage, theme switching, introductory reveal, wordmark and favicon assets, and app metadata. Commerce, checkout, Supabase integration, and admin workflows are subsequent implementation phases.
