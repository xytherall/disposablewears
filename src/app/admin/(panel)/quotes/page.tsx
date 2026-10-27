import { setQuoteStatus } from "@/app/admin/actions";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { Badge, Empty, PageTitle, QUOTE_STATUS, Tabs } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { formatDate, whatsappLink } from "@/lib/format";
import type { QuoteRequest } from "@/lib/types";

export const metadata = { title: "Bulk quotes" };

export default async function AdminQuotesPage({ searchParams }: PageProps<"/admin/quotes">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in QUOTE_STATUS ? sp.status : null;

  let query = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200);
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const quotes = (data ?? []) as QuoteRequest[];

  const tabs = [
    { key: "all", label: "All", href: "/admin/quotes" },
    ...Object.entries(QUOTE_STATUS).map(([k, v]) => ({ key: k, label: v.label, href: `/admin/quotes?status=${k}` })),
  ];

  return (
    <>
      <PageTitle title="Bulk quotes" text="Quote requests from the Bulk orders page. Reply on WhatsApp, then mark how it went." />
      <Tabs tabs={tabs} active={status ?? "all"} />

      {quotes.length === 0 ? (
        <Empty>No quote requests here yet.</Empty>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => {
            const wa = q.phone.replace(/\D/g, "").replace(/^0/, "92");
            const waText = `Assalam o Alaikum ${q.name}, this is Disposable Wears about your bulk quote request.`;
            return (
              <li key={q.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-navy-900">
                      {q.name}
                      {q.business_name && <span className="font-medium text-ink"> · {q.business_name}</span>}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {[q.business_type, q.city, q.phone, formatDate(q.created_at)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Badge tone={QUOTE_STATUS[q.status].tone}>{QUOTE_STATUS[q.status].label}</Badge>
                </div>
                <pre className="mt-4 rounded-xl bg-slate-50 p-4 font-sans text-sm whitespace-pre-wrap text-ink">{q.products}</pre>
                {q.message && <p className="mt-3 text-sm text-ink"><span className="font-semibold">Note:</span> {q.message}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a href={whatsappLink(wa, waText)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-4 py-2 text-sm">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={`tel:${q.phone.replace(/\s/g, "")}`} className="btn-outline px-4 py-2 text-sm">
                    <PhoneIcon className="h-4 w-4" /> Call
                  </a>
                  <form action={setQuoteStatus.bind(null, q.id)} className="ml-auto flex gap-2">
                    <select name="status" defaultValue={q.status} className="field py-2 text-sm" aria-label="Status">
                      {Object.entries(QUOTE_STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <button className="btn-dark px-4 py-2 text-sm">Save</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
