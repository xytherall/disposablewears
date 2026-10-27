import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Product } from "@/lib/types";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("products")
    .select("*, variants:product_variants(id, name, price, stock, sort)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const product = data as Product;
  product.variants.sort((a, b) => a.sort - b.sort);

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-block text-sm font-semibold text-brand-600 hover:underline">← All products</Link>
      <PageTitle
        title={product.name}
        action={
          product.active ? (
            <Link href={`/products/${product.slug}`} target="_blank" className="btn-outline px-4 py-2 text-sm">View in shop ↗</Link>
          ) : undefined
        }
      />
      <ProductForm product={product} justCreated={saved === "1"} />
    </>
  );
}
