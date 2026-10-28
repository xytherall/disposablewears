import Link from "next/link";
import { FaqList, HOME_FAQS } from "@/components/Faq";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/Icons";
import { ProductShot } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { Layer, Parallax } from "@/components/home/Parallax";
import { CATEGORIES } from "@/lib/catalog";
import { getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

const CATEGORY_ART: Record<string, { slug: string; art: string; variant: string }> = {
  "bed-couch": { slug: "disposable-bed-sheet", art: "bedsheet", variant: "Blue" },
  gowns: { slug: "ot-gown-with-trouser", art: "gown", variant: "Blue" },
  "head-foot": { slug: "bouffant-cap", art: "cap", variant: "Blue" },
  "masks-gloves": { slug: "face-mask", art: "mask", variant: "Black" },
  aprons: { slug: "chef-apron", art: "apron", variant: "Blue" },
};

const TICKER = ["Free delivery in Lahore", "Cash on delivery", "Retail & bulk", "Delivered all over Pakistan", "Single use, always fresh"];

const AUDIENCES = [
  { title: "Hospitals & clinics", text: "Bed sheets, isolation and OT gowns, caps, shoe covers and masks for wards, OTs and OPDs." },
  { title: "Salons & barbers", text: "Fresh capes, aprons, caps and gloves for every client, so every chair looks clean." },
  { title: "Spas & beauty", text: "Spa gowns, couch covers and bed sheets that make every client feel looked after." },
  { title: "Kitchens & food", text: "Aprons, gloves, caps and masks that keep food handling hygienic." },
];

const STEPS = [
  { title: "Pick", text: "Choose colours and pack sizes, or send us your bulk list." },
  { title: "Pay", text: "Cash on delivery, bank transfer, JazzCash or Easypaisa." },
  { title: "Receive", text: "Packed and shipped to any city in Pakistan." },
];

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-lab relative -mt-20 overflow-hidden pt-20">
        <div className="pointer-events-none absolute top-1/4 -right-40 h-[560px] w-[560px] rounded-full bg-volt/25 blur-[120px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full bg-sky-300/40 blur-[120px]" aria-hidden />

        <div className="container-page relative pt-10 pb-16 sm:pt-14 lg:pb-24">
          <div className="tag flex justify-between text-night/50">
            <span>DW / Lahore, PK</span>
            <span className="hidden sm:inline">Single-use hygiene supply</span>
          </div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h1 className="animate-fade-up font-display text-[13vw] leading-[0.88] font-extrabold tracking-[-0.045em] text-night sm:text-[4.6rem] lg:text-[5.6rem]">
                Fresh for
                <br />
                every
                <br />
                <span className="relative inline-block h-[0.95em] overflow-hidden align-bottom text-volt">
                  <span className="animate-words block">
                    {["patient.", "client.", "guest.", "patient."].map((w, i) => (
                      <span key={i} className="block h-[0.95em] leading-[0.95]">{w}</span>
                    ))}
                  </span>
                </span>
              </h1>
              <p className="animate-fade-up delay-1 mt-7 max-w-md text-lg leading-relaxed text-night/70">
                Disposable bed sheets, gowns, caps, shoe covers, masks, gloves and aprons for hospitals, clinics, salons
                and spas. One pack or a truckload.
              </p>
              <div className="animate-fade-up delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="btn-volt py-3.5">
                  Shop products <ArrowRightIcon />
                </Link>
                <Link href="/bulk-orders" className="btn-ghost py-3.5">
                  Get a bulk quote
                </Link>
              </div>
              <dl className="animate-fade-up delay-3 mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-night/10 pt-6">
                {[
                  [String(products.length), "Products"],
                  ["COD", "On any order"],
                  ["PK", "Wide delivery"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="tag text-night/45">{l}</dt>
                    <dd className="font-display mt-1 text-3xl font-bold tracking-tight text-night">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Floating products */}
            <Parallax className="relative order-first mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] lg:order-none lg:max-w-[540px] [perspective:1200px]">
              <div className="glass absolute inset-[12%] rounded-full" aria-hidden />
              <div className="absolute inset-[24%] rounded-full bg-gradient-to-br from-volt/30 to-sky-300/30 blur-2xl" aria-hidden />

              <Layer depth={1.4} className="absolute top-[6%] left-[22%] w-[56%]">
                <div className="animate-bob">
                  <ProductShot slug="isolation-gown" art="gown" variant="Blue" label="Isolation gown" className="float-item w-full" />
                </div>
              </Layer>
              <Layer depth={2.2} className="absolute bottom-[8%] left-[0%] w-[38%]">
                <div className="animate-bob [--r:-8deg] [animation-delay:-2s]">
                  <ProductShot slug="bouffant-cap" art="cap" variant="Blue" label="Bouffant cap" className="float-item w-full" />
                </div>
              </Layer>
              <Layer depth={2.8} className="absolute right-[0%] bottom-[14%] w-[36%]">
                <div className="animate-bob [--r:10deg] [animation-delay:-4s]">
                  <ProductShot slug="disposable-gloves" art="gloves" variant="Transparent" label="Gloves" className="float-item w-full" />
                </div>
              </Layer>

              <Layer depth={3.4} className="absolute top-[14%] right-[-2%] hidden sm:block">
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="tag text-night/50">Single use</p>
                  <p className="font-display mt-0.5 text-xl font-bold text-night">Always fresh</p>
                </div>
              </Layer>
              <Layer depth={3} className="absolute bottom-[2%] left-[34%]">
                <div className="glass flex items-center gap-2.5 rounded-full px-4 py-2.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-night">Cash on delivery</span>
                </div>
              </Layer>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden bg-night py-4 text-white">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="font-display flex items-center gap-10 text-lg font-semibold tracking-tight">
              {t} <span className="text-volt">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories as an index */}
      <section className="container-page pt-24 sm:pt-32">
        <div className="reveal flex items-end justify-between gap-6">
          <h2 className="font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.04em] text-night sm:text-7xl">
            The range<span className="text-volt">.</span>
          </h2>
          <p className="tag hidden text-night/50 sm:block">{CATEGORIES.length} categories / {products.length} products</p>
        </div>
        <ul className="mt-10 border-t border-night/15">
          {CATEGORIES.map((c, i) => {
            const a = CATEGORY_ART[c.slug];
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <li key={c.slug} className="reveal border-b border-night/15">
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[4rem_1fr_auto_auto] sm:py-8"
                >
                  <span className="tag text-night/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl font-bold tracking-tight text-night transition group-hover:translate-x-2 group-hover:text-volt sm:text-4xl">
                    {c.name}
                  </span>
                  <span className="tag hidden text-night/45 sm:block">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                  <span className="relative h-14 w-14 sm:h-20 sm:w-20">
                    <ProductShot
                      slug={a.slug}
                      art={a.art}
                      variant={a.variant}
                      className="float-item absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.6] group-hover:-rotate-12"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured products */}
      <section className="container-page pt-24 sm:pt-32">
        <div className="reveal flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="tag text-volt">Shop the range</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.95] font-extrabold tracking-[-0.04em] text-night sm:text-7xl">
              Our products<span className="text-volt">.</span>
            </h2>
          </div>
          <Link href="/products" className="btn-ghost self-start sm:self-auto">
            View all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="relative mt-24 overflow-hidden bg-volt py-24 text-white sm:mt-32 sm:py-32">
        <div className="pointer-events-none absolute -top-40 -left-20 h-[480px] w-[480px] rounded-full bg-sky-300/40 blur-[120px]" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -bottom-40 h-[480px] w-[480px] rounded-full bg-night/50 blur-[120px]" aria-hidden />
        <div className="container-page relative">
          <h2 className="reveal font-display max-w-3xl text-5xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-7xl">
            Made for places that care about clean.
          </h2>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => (
              <div key={a.title} className="glass-dark reveal rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/15">
                <p className="tag text-white/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-10 text-2xl font-bold tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page pt-24 sm:pt-32">
        <p className="tag reveal text-volt">How ordering works</p>
        <ol className="mt-6 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal border-t-2 border-night pt-6">
              <span className="font-display block text-[7rem] leading-none font-extrabold tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_var(--color-volt)]">
                {i + 1}
              </span>
              <h3 className="font-display mt-4 text-3xl font-bold tracking-tight text-night">{s.title}.</h3>
              <p className="mt-2 max-w-xs text-night/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bulk */}
      <section className="container-page pt-24 sm:pt-32">
        <Parallax className="relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-16 text-white sm:px-14 sm:py-20 [perspective:1200px]">
          <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-volt/60 blur-[110px]" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="tag text-white/50">Bulk & repeat orders</p>
              <h2 className="font-display mt-4 text-5xl leading-[0.92] font-extrabold tracking-[-0.04em] sm:text-7xl">
                Stocking a whole hospital?
              </h2>
              <p className="mt-6 max-w-md text-lg text-white/70">
                Tell us what you need and how much. We&apos;ll send a custom price for bulk and monthly supply.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/bulk-orders" className="btn rounded-full bg-white px-6 py-3.5 text-night hover:bg-volt hover:text-white">
                  Request a quote <ArrowRightIcon />
                </Link>
                <a
                  href={whatsappLink(settings.whatsapp, "Hi, I'd like a bulk price for disposable products.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp rounded-full px-6 py-3.5"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="relative hidden aspect-square lg:block" aria-hidden>
              <Layer depth={1.6} className="absolute inset-[8%]">
                <div className="animate-bob">
                  <ProductShot slug="disposable-bed-sheet" art="bedsheet" variant="Blue" className="float-item w-full" />
                </div>
              </Layer>
            </div>
          </div>
        </Parallax>
      </section>

      {/* FAQ */}
      <section className="container-page pt-24 sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="reveal">
            <h2 className="font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.04em] text-night sm:text-6xl">
              Questions<span className="text-volt">?</span>
            </h2>
            <p className="mt-5 text-night/65">
              Can&apos;t find your answer?{" "}
              <Link href="/contact" className="font-semibold text-volt hover:underline">
                Get in touch
              </Link>{" "}
              and we&apos;ll reply quickly.
            </p>
            <Link href="/faq" className="btn-ghost mt-6">
              See all FAQs
            </Link>
          </div>
          <FaqList items={HOME_FAQS} />
        </div>
      </section>
    </>
  );
}
