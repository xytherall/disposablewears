import Link from "next/link";
import { ProductActiveToggle } from "@/components/admin/ProductActiveToggle";
import { Badge, Empty, PageTitle } from "@/components/admin/ui";
import { ProductImage } from "@/components/ProductArt";
import { requireAdmin } from "@/lib/admin";
import { categoryName } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("products")
    .select("*, variants:product_variants(id, name, price, stock, sort)")
    .order("sort")
    .order("name");
  const products = (data ?? []) as Product[];

  return (
    <>
      <PageTitle
        title="Products"
        text="Change prices, stock, colours and photos. Hidden products don't show in the shop."
        action={<Link href="/admin/products/new" className="btn-primary">+ Add product</Link>}
      />
      {products.length === 0 ? (
        <Empty>No products yet. Add your first product.</Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {products.map((p) => {
              const prices = p.variants.map((v) => v.price);
              const min = Math.min(...prices);
              const max = Math.max(...prices);
              const stock = p.variants.reduce((n, v) => n + v.stock, 0);
              const anyOut = p.variants.some((v) => v.stock === 0);
              return (
                <li key={p.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                  <Link href={`/admin/products/${p.id}`} className="shrink-0 overflow-hidden rounded-xl border border-line">
                    <ProductImage product={p} variant={p.variants[0]?.name} className="block h-14 w-14" />
                  </Link>
                  <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1">
                    <p className="font-bold text-navy-900 hover:text-brand-700">{p.name}</p>
                    <p className="text-sm text-muted">
                      {categoryName(p.category)} · {p.variants.length} {p.variants.length === 1 ? "option" : "options"} ·{" "}
                      {min === max ? formatPKR(min) : `${formatPKR(min)}–${formatPKR(max)}`}
                    </p>
                  </Link>
                  <div className="hidden items-center gap-2 sm:flex">
                    {p.featured && <Badge tone="blue">Best seller</Badge>}
                    <Badge tone={anyOut ? "red" : stock < 50 ? "amber" : "gray"}>{anyOut ? "Some out of stock" : `${stock} in stock`}</Badge>
                  </div>
                  <ProductActiveToggle id={p.id} active={p.active} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
