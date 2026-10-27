import Link from "next/link";
import { FaqList, HOME_FAQS } from "@/components/Faq";
import {
  ArrowRightIcon,
  BoxIcon,
  CashIcon,
  CheckIcon,
  FeatherIcon,
  ShieldIcon,
  SparkleIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES } from "@/lib/catalog";
import { getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

const CATEGORY_ART: Record<string, { art: string; variant: string }> = {
  "bed-couch": { art: "bedsheet", variant: "Blue" },
  gowns: { art: "gown", variant: "Blue" },
  "head-foot": { art: "cap", variant: "Blue" },
  "masks-gloves": { art: "mask", variant: "Blue" },
  aprons: { art: "apron", variant: "White" },
};

const PROMISES = [
  { icon: ShieldIcon, title: "Maximum protection", text: "Single-use items that keep every patient and client on a fresh surface." },
  { icon: SparkleIcon, title: "Premium quality", text: "Soft non-woven fabric that holds up through the whole treatment." },
  { icon: FeatherIcon, title: "Comfortable & lightweight", text: "Breathable materials that are easy to wear for long shifts." },
  { icon: BoxIcon, title: "Disposable & hygienic", text: "Use once and throw away. No washing, no laundry costs." },
];

const AUDIENCES = [
  {
    title: "Hospitals & clinics",
    text: "Bed sheets, isolation and OT gowns, caps, shoe covers and masks for wards, OTs and OPDs.",
    items: ["Bed sheets", "Isolation gowns", "OT gowns", "Shoe covers"],
  },
  {
    title: "Salons & barbers",
    text: "Fresh capes, aprons, caps and gloves for every client, so your chairs always look clean.",
    items: ["Barber aprons", "Gloves", "Bouffant caps", "Masks"],
  },
  {
    title: "Spas & beauty centres",
    text: "Spa gowns, couch covers and bed sheets that make every client feel looked after.",
    items: ["Spa gowns", "Couch covers", "Bed sheets", "Caps"],
  },
  {
    title: "Kitchens & food handling",
    text: "Aprons, gloves, caps and masks that keep food handling hygienic.",
    items: ["Chef aprons", "Gloves", "Caps", "Masks"],
  },
];

const STEPS = [
  { title: "Choose your products", text: "Pick colours and pack sizes, or send us your bulk requirement." },
  { title: "Confirm your order", text: "Pay cash on delivery, or by bank transfer, JazzCash or Easypaisa." },
  { title: "Delivered to your door", text: "We ship to every city in Pakistan, packed and ready to use." },
];

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-brand-600/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-brand-500/25 blur-3xl" aria-hidden />

        <div className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Your partner in protection
            </p>
            <h1 className="animate-fade-up delay-1 mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Disposable hygiene essentials, <span className="text-gradient">delivered across Pakistan.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg leading-relaxed text-blue-100/85">
              Bed sheets, gowns, caps, shoe covers, masks, gloves and aprons for hospitals, clinics, salons and spas.
              Order a single pack or stock up in bulk.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn bg-white text-navy-900 hover:bg-brand-50">
                Shop products <ArrowRightIcon />
              </Link>
              <Link href="/bulk-orders" className="btn border border-white/25 bg-white/5 text-white hover:bg-white/10">
                Get a bulk quote
              </Link>
            </div>
            <ul className="animate-fade-up delay-3 mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm text-blue-100 sm:grid-cols-3">
              {["Cash on Delivery", "Nationwide delivery", "Retail & bulk"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/30 text-blue-200">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Product collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="animate-float space-y-4 sm:space-y-5">
                <HeroTile art="bedsheet" variant="Blue" label="Bed sheets" />
                <HeroTile art="mask" variant="Blue" label="Face masks" />
              </div>
              <div className="animate-float-slow mt-10 space-y-4 sm:space-y-5">
                <HeroTile art="gown" variant="Blue" label="Gowns" />
                <HeroTile art="cap" variant="Blue" label="Bouffant caps" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="relative z-10 -mt-px border-b border-line bg-white">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon />
              </span>
              <div>
                <h3 className="font-bold text-navy-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page pt-20">
        <SectionHeading eyebrow="Shop by category" title="Everything you need for a clean, safe workspace" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const a = CATEGORY_ART[c.slug];
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="group overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-600/10"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ProductArt art={a.art} variant={a.variant} label={c.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="leading-snug font-bold text-navy-900">{c.name}</h3>
                  <p className="mt-0.5 text-sm text-muted">{count} {count === 1 ? "product" : "products"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page pt-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Best sellers" title="Popular with our customers" align="left" />
          <Link href="/products" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">
            View all products <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="mt-24 bg-brand-50/60 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who we serve"
            title="Made for the places that care about hygiene"
            text="From busy hospital wards to neighbourhood salons, our products help you give every person a fresh, clean experience."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="rounded-3xl border border-white bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {a.items.map((i) => (
                    <li key={i} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page pt-24">
        <SectionHeading eyebrow="How ordering works" title="Simple ordering, from one pack to a truckload" />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-line bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-navy-900">
          <span className="flex items-center gap-2"><CashIcon className="h-5 w-5 text-brand-600" /> Cash on Delivery</span>
          <span className="flex items-center gap-2"><CashIcon className="h-5 w-5 text-brand-600" /> Bank transfer</span>
          <span className="flex items-center gap-2"><CashIcon className="h-5 w-5 text-brand-600" /> JazzCash</span>
          <span className="flex items-center gap-2"><CashIcon className="h-5 w-5 text-brand-600" /> Easypaisa</span>
          <span className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-brand-600" /> All over Pakistan</span>
        </div>
      </section>

      {/* Bulk CTA */}
      <section className="container-page pt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-navy-900 px-6 py-14 text-white sm:px-12">
          <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Buying for a hospital, chain or clinic?</h2>
              <p className="mt-4 max-w-xl text-lg text-blue-100">
                Tell us what you need and how much. We&apos;ll send you a custom price for bulk and repeat orders.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/bulk-orders" className="btn bg-white text-navy-900 hover:bg-brand-50">
                Request a quote <ArrowRightIcon />
              </Link>
              <a
                href={whatsappLink(settings.whatsapp, "Hi, I'd like a bulk price for disposable products.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="FAQs" title="Questions we get asked a lot" align="left" />
            <p className="mt-4 text-muted">
              Can&apos;t find your answer?{" "}
              <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                Get in touch
              </Link>{" "}
              and we&apos;ll reply quickly.
            </p>
            <Link href="/faq" className="btn-outline mt-6">
              See all FAQs
            </Link>
          </div>
          <FaqList items={HOME_FAQS} />
        </div>
      </section>
    </>
  );
}

function HeroTile({ art, variant, label }: { art: string; variant: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/30 backdrop-blur-md">
      <div className="overflow-hidden rounded-2xl">
        <ProductArt art={art} variant={variant} label={label} className="block aspect-square w-full" />
      </div>
      <p className="px-2 pt-2 pb-1 text-sm font-semibold text-white">{label}</p>
    </div>
  );
}
