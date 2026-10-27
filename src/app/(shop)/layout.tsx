import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <CartProvider>
      <Header announcement={settings.announcement} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloat number={settings.whatsapp} />
    </CartProvider>
  );
}
