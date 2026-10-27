import Link from "next/link";
import { Badge, Card, Empty, ORDER_STATUS, PAYMENT_STATUS, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { formatDate, formatPKR, orderLabel } from "@/lib/format";
import type { Order } from "@/lib/types";

const LOW_STOCK = 20;

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();
  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);

  const [newOrders, toVerify, newQuotes, lowStock, recent, monthSales] = await Promise.all([
    count(supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")),
    count(supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending_verification").neq("status", "cancelled")),
    count(supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new")),
    supabase
      .from("product_variants")
      .select("id, name, stock, product:products(id, name)")
      .lt("stock", LOW_STOCK)
      .order("stock")
      .limit(8)
      .then((r) => (r.data ?? []) as unknown as { id: string; name: string; stock: number; product: { id: string; name: string } }[]),
    supabase
      .from("orders")
      .select("id, order_no, customer_name, city, total, delivery_fee, status, payment_status, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
      .then((r) => (r.data ?? []) as Order[]),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .then((r) => (r.data ?? []).reduce((n, o) => n + (o.total as number), 0)),
  ]);

  const stats = [
    { label: "New orders", value: newOrders, href: "/admin/orders?status=pending", tone: "text-amber-600" },
    { label: "Payments to check", value: toVerify, href: "/admin/orders?payment=pending_verification", tone: "text-amber-600" },
    { label: "New quote requests", value: newQuotes, href: "/admin/quotes?status=new", tone: "text-brand-600" },
    { label: "Sales this month", value: formatPKR(monthSales), href: "/admin/orders", tone: "text-emerald-600" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" text="What needs your attention today." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-500">
            <p className="text-sm font-medium text-muted">{s.label}</p>
            <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${s.tone}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Latest orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:underline">All orders →</Link>
          </div>
          {recent.length === 0 ? (
            <Empty>No orders yet. They&apos;ll show up here as soon as customers check out.</Empty>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:text-brand-700">
                    <span>
                      <span className="font-bold text-navy-900">{orderLabel(o.order_no)}</span>{" "}
                      <span className="text-ink">{o.customer_name}</span>
                      <span className="block text-xs text-muted">{o.city} · {formatDate(o.created_at)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge tone={PAYMENT_STATUS[o.payment_status].tone}>{PAYMENT_STATUS[o.payment_status].label}</Badge>
                      <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                      <span className="w-20 text-right font-semibold">{formatPKR(o.total)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold text-navy-900">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted">Everything has at least {LOW_STOCK} in stock.</p>
          ) : (
            <ul className="space-y-2.5">
              {lowStock.map((v) => (
                <li key={v.id}>
                  <Link href={`/admin/products/${v.product.id}`} className="flex items-center justify-between gap-3 text-sm hover:text-brand-700">
                    <span>{v.product.name} <span className="text-muted">· {v.name}</span></span>
                    <Badge tone={v.stock === 0 ? "red" : "amber"}>{v.stock === 0 ? "Out" : `${v.stock} left`}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
