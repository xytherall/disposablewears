import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="text-5xl leading-[0.95] font-extrabold tracking-[-0.045em] text-night sm:text-7xl">Your cart<span className="text-volt">.</span></h1>
      <CartView settings={settings} />
    </div>
  );
}
