# NIVORA ESSENTIALS

Premium everyday essentials for men, women, boys, and girls.

**Brand line:** Comfort for Every Body.

## Brand direction
- Primary identity: charcoal and warm ivory, with a refined serif wordmark and signature V detail.
- Website themes: persistent light and dark modes.
- Intro: cinematic NIVORA wordmark reveal with a skip control on the homepage only.
- Product imagery: generated sample clothing photography mapped to all 20 preview products; replace with approved supplier/product photography before launch.
- Homepage footer: discreet “For owner” link to the private `/admin` workspace.
- Audience: men, women, boys, and girls.
- Retail and wholesale share a catalogue; wholesale currently has a provisional minimum of 10 units. Confirm the final MOQ and wholesale price list before launch.

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (order database; service-role access stays server-side)
- Resend (store order notifications)
- Vercel (deployment)

## Local development
1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in credentials.
4. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor.
5. Run `npm run dev` and open http://localhost:3000.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key (not currently needed by the checkout API).
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase secret/service key used by order and admin APIs. Obtain it from Supabase project API keys; never commit it to this public repository.
- `ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`: private admin login credentials; use a long random session secret.
- `RESEND_API_KEY`: server-only Resend API key.
- `ORDER_NOTIFICATION_EMAIL`: store inbox for new order alerts.
- `RESEND_FROM_EMAIL`: optional sender address verified in Resend. If omitted, the API uses Resend's onboarding sender for initial testing.

Never commit real credentials. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to browser code.

## Commerce currently implemented
- Product catalogue with audience, size, type, price-range filters and price sorting.
- Product detail dialog with size and quantity selection.
- Browser-persisted shopping bag with quantity editing and subtotal.
- Retail / wholesale pay-later checkout.
- Server-side validation of product IDs, sizes, quantities and prices (prices are recalculated from the catalogue; browser totals are not trusted).
- Supabase order persistence and optional Resend store notification.
- Order confirmation reference after successful database insertion.

## Checkout setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL Editor.
3. Add the Supabase URL and service-role key to Vercel project environment variables (and `.env.local` for local testing).
4. Add a Resend API key and the store notification email. Verify a sender domain and set `RESEND_FROM_EMAIL` before production.
5. Deploy and submit a test order. Confirm it appears in Supabase and the store inbox receives the notification.

If Supabase is not configured, checkout intentionally returns a setup error and does not pretend an order was placed. If Resend is not configured, orders can still be saved but the store notification will not be sent.

## Before accepting real orders
- Replace provisional artwork, product descriptions and sample prices with approved catalogue data.
- Confirm wholesale MOQ and actual wholesale price list; the current 10-unit threshold is a placeholder.
- Connect live inventory / variant availability and add admin order management.
- Add customer order emails, shipping/tax rules, legal pages and privacy/retention controls.
- Test checkout on mobile and desktop, then complete a production build.
