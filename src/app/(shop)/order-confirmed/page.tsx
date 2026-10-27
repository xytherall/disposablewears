import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function OrderConfirmedPage() {
  const settings = await getSettings();
  return (
    <div className="container-page max-w-3xl pt-12 sm:pt-16">
      <OrderConfirmation whatsapp={settings.whatsapp} />
    </div>
  );
}
