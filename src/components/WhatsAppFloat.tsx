import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFloat({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hi Disposable Wears, I'd like to ask about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-green-900/20 transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
