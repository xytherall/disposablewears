import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-muted">We deliver all over Pakistan. We&apos;ll call or WhatsApp you to confirm your order.</p>
      <CheckoutForm settings={settings} />
    </div>
  );
}
