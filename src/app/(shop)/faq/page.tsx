import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_GROUPS, FaqList } from "@/components/Faq";
import { WhatsAppIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about ordering, bulk prices, payment and delivery at Disposable Wears.",
};

export default async function FaqPage() {
  const settings = await getSettings();
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Help centre" title="Frequently asked questions" text="Everything about ordering, payment and delivery." />
      <div className="container-page grid gap-12 pt-14 lg:grid-cols-[1fr_2.2fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="flex gap-2 lg:flex-col">
            {FAQ_GROUPS.map((g) => (
              <a key={g.title} href={`#${g.title.toLowerCase()}`} className="rounded-xl px-4 py-2.5 font-semibold text-navy-900 hover:bg-brand-50">
                {g.title}
              </a>
            ))}
          </nav>
          <div className="mt-8 hidden rounded-3xl bg-navy-950 p-6 text-white lg:block">
            <p className="font-bold">Still have a question?</p>
            <p className="mt-1 text-sm text-blue-100/80">Message us and we&apos;ll get back to you quickly.</p>
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4 w-full">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
            </a>
          </div>
        </aside>
        <div className="space-y-12">
          {FAQ_GROUPS.map((g) => (
            <section key={g.title} id={g.title.toLowerCase()} className="scroll-mt-28">
              <h2 className="mb-5 text-2xl font-extrabold text-navy-900">{g.title}</h2>
              <FaqList items={g.items} />
            </section>
          ))}
          <p className="text-muted">
            Didn&apos;t find what you need?{" "}
            <Link href="/contact" className="font-semibold text-brand-600 hover:underline">Contact us</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
