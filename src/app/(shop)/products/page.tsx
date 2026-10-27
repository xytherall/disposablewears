import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, categoryName } from "@/lib/catalog";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products",
  description: "Shop disposable bed sheets, couch covers, gowns, caps, shoe covers, masks, gloves and aprons. Retail and bulk.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { category } = await searchParams;
  const active = typeof category === "string" && CATEGORIES.some((c) => c.slug === category) ? category : null;
  const products = await getProducts();
  const shown = active ? products.filter((p) => p.category === active) : products;

  return (
    <>
      <PageHero
        eyebrow="Our products"
        title={active ? categoryName(active) : "All products"}
        text="Single-use hygiene products for hospitals, clinics, salons, spas and kitchens. Prices are per piece or per pack."
      />
      <div className="container-page pt-10">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <FilterChip href="/products" active={!active} label="All" count={products.length} />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.slug}
              href={`/products?category=${c.slug}`}
              active={active === c.slug}
              label={c.name}
              count={products.filter((p) => p.category === c.slug).length}
            />
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-16 text-center text-muted">No products here yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
        active
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-line bg-white text-ink hover:border-brand-500 hover:text-brand-700"
      }`}
    >
      {label} <span className={active ? "text-blue-200" : "text-muted"}>({count})</span>
    </Link>
  );
}
