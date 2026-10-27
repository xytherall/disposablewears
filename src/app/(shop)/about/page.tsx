import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, BoxIcon, FeatherIcon, ShieldIcon, SparkleIcon, TruckIcon, CashIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { ProductArt } from "@/components/ProductArt";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About us",
  description: "Disposable Wears supplies single-use hygiene products to hospitals, clinics, salons and spas across Pakistan, from Lahore.",
};

const VALUES = [
  { icon: ShieldIcon, title: "Safety first", text: "Single-use products mean no cross-contamination between patients or clients." },
  { icon: SparkleIcon, title: "Quality you can feel", text: "Soft, strong non-woven fabrics that look professional and hold up in use." },
  { icon: FeatherIcon, title: "Comfort", text: "Lightweight, breathable items that staff and clients are happy to wear." },
  { icon: BoxIcon, title: "Ready when you are", text: "Stock for one-off orders, and steady supply for regular bulk buyers." },
  { icon: CashIcon, title: "Fair prices", text: "Honest prices for single packs, and better rates for bulk." },
  { icon: TruckIcon, title: "Nationwide delivery", text: "From our base in Lahore to every city in Pakistan." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Because your safety matters" text="We make hygiene simple for the places that look after people." />

      <section className="container-page grid items-center gap-12 pt-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Who we are" title="A Lahore supplier of disposable hygiene wear" align="left" />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              Disposable Wears supplies single-use hygiene products to hospitals, clinics, salons, spas and kitchens across
              Pakistan. We work directly with manufacturers, so we can offer good quality at fair prices, whether you need
              one pack or a regular bulk supply.
            </p>
            <p>
              Our range covers bed sheets and couch covers, isolation and OT gowns, spa gowns, bouffant caps, shoe covers,
              face masks, gloves and aprons. Everything is made to be used once and thrown away, so every patient and client
              gets something fresh.
            </p>
          </div>
          <Link href="/products" className="btn-primary mt-8">
            Browse our products <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4" aria-hidden>
          {[
            ["bedsheet", "Blue"], ["gown", "White"], ["cap", "Blue"],
            ["mask", "Black"], ["spa", "Black"], ["shoe", "Blue"],
            ["apron", "White"], ["gloves", "Transparent"], ["scrubs", "Blue"],
          ].map(([art, v]) => (
            <div key={art} className="bg-lab rounded-3xl border border-night/[0.06] p-3 transition hover:-translate-y-1">
              <ProductArt art={art} variant={v} label="" bare className="float-item block aspect-square w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-brand-50/60 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="What we stand for" title="Why customers choose Disposable Wears" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-white p-7 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-white">
                  <Icon />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pt-20 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy-900">Let&apos;s keep your workplace clean and safe</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">Talk to us about your needs. We&apos;re happy to help you choose.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">Contact us</Link>
          <Link href="/bulk-orders" className="btn-outline">Get a bulk quote</Link>
        </div>
      </section>
    </>
  );
}
