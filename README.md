# Disposable Wears website

Online store for **Disposable Wears** (Lahore): disposable bed sheets, couch covers, gowns, caps, shoe covers, masks, gloves and aprons for hospitals, clinics, salons and spas.

Built with [Next.js](https://nextjs.org) and Tailwind CSS. The database, admin login and file storage use [Supabase](https://supabase.com) (free plan). It's meant to be hosted on [Vercel](https://vercel.com) (free plan).

## Build phases

1. **Design and main pages** (done): home, products, product pages, About, Contact, FAQs, bulk quote form, policies, WhatsApp button.
2. **Cart and checkout** (done): Cash on Delivery, bank transfer, JazzCash, Easypaisa. Free delivery in Lahore; other cities confirmed per order. Until Supabase is connected, orders are sent to the owner on WhatsApp.
3. Admin portal and database: manage products, prices, stock, orders and quote requests.
4. Real product photos, going live, and connecting the domain.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Until Supabase is connected, the site shows the built-in product list from `src/lib/catalog.ts`.

## Where things are

| What | Where |
| --- | --- |
| Product list, prices, colours (starting data) | `src/lib/catalog.ts` |
| Pages | `src/app/(shop)/` |
| Logo | `src/components/Logo.tsx` |
| Product drawings (used until real photos are added) | `src/components/ProductArt.tsx` |
| FAQ questions and answers | `src/components/Faq.tsx` |
| Colours and fonts | `src/app/globals.css` |
| Database setup (used from Phase 3) | `supabase/schema.sql`, `supabase/seed.sql` |
