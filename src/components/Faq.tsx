export type FaqItem = { q: string; a: string };

export const FAQ_GROUPS: { title: string; items: FaqItem[] }[] = [
  {
    title: "Ordering",
    items: [
      {
        q: "Can I order small quantities, or only bulk?",
        a: "Both. You can order a single piece or pack, and we also supply hospitals, clinics, salons and spas in bulk.",
      },
      {
        q: "How do I get a bulk price?",
        a: "Fill in the bulk quote form or message us on WhatsApp with the products and quantities you need. We'll send you a custom price.",
      },
      {
        q: "Which colours are available?",
        a: "Most items come in blue, white or black. Each product page shows the colours available for that item.",
      },
      {
        q: "Are these products single use?",
        a: "Yes. Every item is made to be used once and thrown away, so each patient or client gets a fresh one.",
      },
    ],
  },
  {
    title: "Payment",
    items: [
      {
        q: "How can I pay?",
        a: "Cash on Delivery, bank transfer, JazzCash or Easypaisa. For online payments, you share the transaction ID or a screenshot when you place your order.",
      },
      {
        q: "Do you give invoices for businesses?",
        a: "Yes. Let us know your business name when ordering and we'll include it on your invoice.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        q: "Do you deliver all over Pakistan?",
        a: "Yes, we deliver to every city in Pakistan. We don't ship outside Pakistan at the moment.",
      },
      {
        q: "How much is delivery?",
        a: "Delivery is free in Lahore. For other cities the charge depends on your city and order size, and we confirm it with you before we dispatch.",
      },
      {
        q: "How long does delivery take?",
        a: "We dispatch orders quickly. Delivery time depends on your city, and we'll tell you when to expect it when we confirm your order.",
      },
      {
        q: "What if my order arrives damaged or wrong?",
        a: "Contact us as soon as you receive it, with a photo of the problem, and we'll sort it out for you.",
      },
    ],
  },
];

export const HOME_FAQS: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[0].items[1],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[2].items[0],
];

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900">
            {item.q}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 pr-10 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
