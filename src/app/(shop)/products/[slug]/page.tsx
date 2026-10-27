import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, ShieldIcon, TruckIcon, CashIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { categoryName } from "@/lib/catalog";
import { getProduct, getProducts, getSettings } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.short_description };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, all, settings] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!product) notFound();

  // Same category first, then best sellers, up to four.
  const others = all.filter((p) => p.id !== product.id);
  const more = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category && p.featured),
  ].slice(0, 4);

  return (
    <>
      <div className="border-b border-line bg-brand-50/50">
        <nav className="container-page flex flex-wrap items-center gap-2 py-4 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-700">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-brand-700">
            {categoryName(product.category)}
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="container-page pt-10">
        <ProductBuyBox product={product} whatsapp={settings.whatsapp} />
      </section>

      <section className="container-page pt-16">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-line p-7 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900">About this product</h2>
            <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
            {product.features.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-4 rounded-3xl bg-navy-950 p-7 text-white sm:p-8">
            <Perk icon={<TruckIcon />} title="Delivery across Pakistan" text="We ship to every city. Delivery time is confirmed with your order." />
            <Perk icon={<CashIcon />} title="Cash on Delivery" text="Or pay by bank transfer, JazzCash or Easypaisa." />
            <Perk icon={<ShieldIcon />} title="Single use, always fresh" text="A new piece for every patient or client." />
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="container-page pt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-navy-900">You may also need</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {more.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Perk({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-200">{icon}</span>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-0.5 text-sm text-blue-100/80">{text}</p>
      </div>
    </div>
  );
}
