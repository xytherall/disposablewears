import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderEditForm } from "@/components/admin/OrderEditForm";
import { Badge, Card, ORDER_STATUS, PAYMENT_STATUS, PageTitle } from "@/components/admin/ui";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import { PAYMENT_LABELS, deliveryLabel, formatDate, formatPKR, orderLabel, whatsappLink } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const order = data as Order;

  let proofUrl: string | null = null;
  if (order.payment_proof_path) {
    const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(order.payment_proof_path, 60 * 60);
    proofUrl = signed?.signedUrl ?? null;
  }
  const proofIsPdf = order.payment_proof_path?.endsWith(".pdf");

  const label = orderLabel(order.order_no);
  const waNumber = order.phone.replace(/\D/g, "").replace(/^0/, "92");
  const waText = `Assalam o Alaikum ${order.customer_name}, this is Disposable Wears about your order ${label}.`;

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-block text-sm font-semibold text-brand-600 hover:underline">← All orders</Link>
      <PageTitle
        title={`Order ${label}`}
        text={`Placed ${formatDate(order.created_at)}`}
        action={
          <div className="flex gap-2">
            <Badge tone={PAYMENT_STATUS[order.payment_status].tone}>{PAYMENT_STATUS[order.payment_status].label}</Badge>
            <Badge tone={ORDER_STATUS[order.status].tone}>{ORDER_STATUS[order.status].label}</Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-navy-900">Items</h2>
            <ul className="divide-y divide-line">
              {order.items.map((l) => (
                <li key={l.variant_id} className="flex justify-between gap-4 py-3">
                  <span>
                    <span className="font-semibold text-ink">{l.product}</span>
                    <span className="block text-sm text-muted">{l.variant} · {l.unit} · {formatPKR(l.price)} × {l.quantity}</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap">{formatPKR(l.line_total)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-2 border-t border-line pt-4">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPKR(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className={order.delivery_fee === null ? "font-semibold text-amber-700" : ""}>{deliveryLabel(order.delivery_fee)}</dd></div>
              <div className="flex justify-between text-lg font-extrabold text-navy-900"><dt>Total</dt><dd>{formatPKR(order.total)}</dd></div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold text-navy-900">Customer</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Info label="Name" value={order.customer_name} />
              <Info label="Phone" value={order.phone} />
              <Info label="Email" value={order.email} />
              <Info label="Business" value={order.business_name} />
              <Info label="City" value={order.city} />
              <Info label="Address" value={order.address} />
              {order.notes && <div className="sm:col-span-2"><Info label="Customer notes" value={order.notes} /></div>}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={whatsappLink(waNumber, waText)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-4 py-2.5 text-sm">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp customer
              </a>
              <a href={`tel:${order.phone.replace(/\s/g, "")}`} className="btn-outline px-4 py-2.5 text-sm">
                <PhoneIcon className="h-4 w-4" /> Call
              </a>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold text-navy-900">Payment</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Info label="Method" value={PAYMENT_LABELS[order.payment_method]} />
              <Info label="Transaction ID" value={order.payment_reference} />
            </dl>
            {proofUrl && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-muted">Payment screenshot</p>
                {proofIsPdf ? (
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">Open PDF</a>
                ) : (
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proofUrl} alt="Payment screenshot" className="max-h-96 rounded-xl border border-line" />
                  </a>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <OrderEditForm order={order} />
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium break-words text-ink">{value || "—"}</dd>
    </div>
  );
}
