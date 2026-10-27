import type { Metadata } from "next";
import { BulkQuoteForm } from "@/components/BulkQuoteForm";
import { CheckIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getProducts, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bulk orders & quotes",
  description: "Get custom bulk prices on disposable hygiene products for hospitals, clinics, salons, spas and kitchens.",
};

const PERKS = [
  "Custom prices for large and repeat orders",
  "Mix any products and colours",
  "Delivery to every city in Pakistan",
  "Cash on Delivery or bank transfer",
];

export default async function BulkOrdersPage({ searchParams }: PageProps<"/bulk-orders">) {
  const { product } = await searchParams;
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Bulk orders"
        title="Get a bulk quote"
        text="Supplying a hospital, clinic chain, salon or spa? Tell us what you need and we'll send you a custom price."
      />
      <div className="container-page grid gap-10 pt-14 lg:grid-cols-[1fr_1.6fr]">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-navy-950 p-7 text-white">
            <h2 className="text-xl font-bold">Why order in bulk with us</h2>
            <ul className="mt-5 space-y-3.5">
              {PERKS.map((p) => (
                <li key={p} className="flex gap-3 text-blue-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-blue-200">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line p-7">
            <h2 className="font-bold text-navy-900">Prefer to talk?</h2>
            <p className="mt-1 text-muted">Call us on <span className="font-semibold text-ink">{settings.phone}</span></p>
          </div>
        </aside>
        <div className="rounded-3xl border border-line p-6 sm:p-9">
          <BulkQuoteForm
            whatsapp={settings.whatsapp}
            products={products.map((p) => ({ slug: p.slug, name: p.name, unit: p.unit }))}
            preselect={typeof product === "string" ? product : undefined}
          />
        </div>
      </div>
    </>
  );
}
