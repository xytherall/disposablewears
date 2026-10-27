import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getSettings } from "@/lib/data";
import { formatPKR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Delivery, returns & policies",
  description: "Delivery, returns, privacy and terms for Disposable Wears.",
};

export default async function PoliciesPage() {
  const s = await getSettings();
  const sections = [
    {
      id: "delivery",
      title: "Delivery",
      body: [
        "We deliver to all cities in Pakistan. We do not ship outside Pakistan.",
        `The delivery charge is ${formatPKR(s.delivery_fee)} per order${
          s.free_delivery_min > 0 ? `, and delivery is free on orders of ${formatPKR(s.free_delivery_min)} or more` : ""
        }. Bulk orders may have separate delivery terms, which we confirm with your quote.`,
        "Delivery time depends on your city. We confirm the expected time when we confirm your order by phone or WhatsApp.",
      ],
    },
    {
      id: "returns",
      title: "Returns & exchanges",
      body: [
        "Because these are hygiene products, we can't take back items once their packaging has been opened.",
        "If your order arrives damaged, incomplete or wrong, contact us as soon as you receive it with your order number and a photo. We'll replace the item or refund you.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: [
        "We only collect the details we need to process and deliver your order: your name, phone number, email, address and payment reference.",
        "We never sell or share your details with anyone except the courier delivering your order.",
      ],
    },
    {
      id: "terms",
      title: "Terms",
      body: [
        "Prices are in Pakistani Rupees and may change without notice. The price shown when you place your order is the price you pay.",
        "Orders paid by bank transfer, JazzCash or Easypaisa are processed once we have verified the payment.",
        "We may cancel an order if a product is out of stock or a payment can't be verified. In that case you'll get a full refund of any amount paid.",
      ],
    },
  ];

  return (
    <>
      <PageHero eyebrow="Policies" title="Delivery, returns & policies" />
      <div className="container-page max-w-3xl space-y-12 pt-14">
        {sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-28">
            <h2 className="text-2xl font-extrabold text-navy-900">{sec.title}</h2>
            <div className="mt-4 space-y-3 text-lg leading-relaxed text-muted">
              {sec.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
        <p className="text-sm text-muted">Questions? Email {s.email} or call {s.phone}.</p>
      </div>
    </>
  );
}
