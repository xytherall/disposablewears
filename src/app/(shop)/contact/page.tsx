import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call, WhatsApp or email Disposable Wears in Lahore. We deliver all over Pakistan.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const cards = [
    { icon: PhoneIcon, title: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: WhatsAppIcon, title: "WhatsApp", value: "Chat with us", href: whatsappLink(s.whatsapp), external: true },
    { icon: MailIcon, title: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: PinIcon, title: "Visit", value: s.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`, external: true },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="We're here to help" text="Questions, orders or bulk requirements: reach us any way you like." />

      <section className="container-page -mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, title, value, href, external }) => (
          <a
            key={title}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="relative rounded-3xl border border-line bg-white p-6 shadow-lg shadow-navy-900/5 transition hover:-translate-y-1 hover:border-brand-100"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-muted">{title}</p>
            <p className={`mt-1 font-bold text-navy-900 ${value.includes("@") ? "text-sm [overflow-wrap:anywhere]" : ""}`}>{value}</p>
          </a>
        ))}
      </section>

      <section className="container-page grid gap-8 pt-16 lg:grid-cols-2">
        <div className="rounded-3xl border border-line p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold text-navy-900">Send us a message</h2>
          <p className="mt-2 text-muted">Fill this in and it opens WhatsApp with your message ready to send.</p>
          <ContactForm whatsapp={s.whatsapp} />
        </div>
        <div className="min-h-[360px] overflow-hidden rounded-3xl border border-line">
          <iframe
            title="Disposable Wears location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&z=14&output=embed`}
            className="h-full min-h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
