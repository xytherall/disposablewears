import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Disposable Wears | Disposable Hygiene Products in Pakistan",
    template: "%s | Disposable Wears",
  },
  description:
    "Disposable bed sheets, couch covers, gowns, caps, shoe covers, masks, gloves and aprons for hospitals, clinics, salons and spas. Retail and bulk orders, delivered across Pakistan.",
  openGraph: {
    siteName: "Disposable Wears",
    type: "website",
    locale: "en_PK",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
