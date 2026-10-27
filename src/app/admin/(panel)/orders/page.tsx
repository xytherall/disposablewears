import Link from "next/link";
import { Badge, Empty, ORDER_STATUS, PAYMENT_STATUS, PageTitle, Tabs } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { PAYMENT_LABELS, formatDate, formatPKR, orderLabel } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in ORDER_STATUS ? sp.status : null;
  const payment = typeof sp.payment === "string" && sp.payment in PAYMENT_STATUS ? sp.payment : null;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 60) : "";

  let query = supabase
    .from("orders")
    .select("id, order_no, customer_name, phone, city, total, delivery_fee, payment_method, payment_status, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (payment) query = query.eq("payment_status", payment).neq("status", "cancelled");
  if (q) {
    const no = Number(q.replace(/\D/g, ""));
    const safe = q.replace(/[%,()]/g, "");
    query = query.or(`customer_name.ilike.%${safe}%,phone.ilike.%${safe}%,city.ilike.%${safe}%${no ? `,order_no.eq.${no}` : ""}`);
  }
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  const tabs = [
    { key: "all", label: "All", href: "/admin/orders" },
    { key: "pending", label: "New", href: "/admin/orders?status=pending" },
    { key: "pending_verification", label: "Check payment", href: "/admin/orders?payment=pending_verification" },
    { key: "confirmed", label: "Confirmed", href: "/admin/orders?status=confirmed" },
    { key: "shipped", label: "Shipped", href: "/admin/orders?status=shipped" },
    { key: "delivered", label: "Delivered", href: "/admin/orders?status=delivered" },
    { key: "cancelled", label: "Cancelled", href: "/admin/orders?status=cancelled" },
  ];

  return (
    <>
      <PageTitle title="Orders" text="Tap an order to see details, check payment and update its status." />
      <Tabs tabs={tabs} active={payment ?? status ?? "all"} />
      <form className="mb-5 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search name, phone, city or order number" className="field max-w-md" />
        <button className="btn-dark px-4 py-2.5">Search</button>
      </form>

      {orders.length === 0 ? (
        <Empty>No orders here yet.</Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="grid gap-2 px-5 py-4 transition hover:bg-brand-50/50 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p>
                      <span className="font-bold text-navy-900">{orderLabel(o.order_no)}</span>{" "}
                      <span className="font-medium text-ink">{o.customer_name}</span>{" "}
                      <span className="text-sm text-muted">· {o.phone}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {o.city} · {formatDate(o.created_at)} · {PAYMENT_LABELS[o.payment_method]}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge tone={PAYMENT_STATUS[o.payment_status].tone}>{PAYMENT_STATUS[o.payment_status].label}</Badge>
                    <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                    <span className="min-w-24 text-right font-bold text-navy-900">
                      {formatPKR(o.total)}
                      {o.delivery_fee === null && <span className="block text-xs font-medium text-amber-700">+ delivery TBC</span>}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
