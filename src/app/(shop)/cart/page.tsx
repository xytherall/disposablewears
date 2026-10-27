import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Your cart</h1>
      <CartView settings={settings} />
    </div>
  );
}
