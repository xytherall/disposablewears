import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-block text-sm font-semibold text-brand-600 hover:underline">← All products</Link>
      <PageTitle title="Add product" />
      <ProductForm product={null} />
    </>
  );
}
