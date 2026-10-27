import { deliveryLabel, formatPKR } from "@/lib/format";

export function OrderSummary({
  subtotal,
  delivery,
  deliveryNote,
  freeDeliveryMin,
  children,
}: {
  subtotal: number;
  delivery: number | null; // null = confirmed after the order
  deliveryNote?: string;
  freeDeliveryMin: number;
  children?: React.ReactNode;
}) {
  const remaining = freeDeliveryMin > 0 && delivery !== 0 ? freeDeliveryMin - subtotal : 0;
  return (
    <div className="rounded-3xl border border-line bg-brand-50/40 p-6">
      <h2 className="text-lg font-bold text-navy-900">Order summary</h2>
      <dl className="mt-5 space-y-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-semibold text-ink">{formatPKR(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Delivery</dt>
          <dd className={`text-right font-semibold ${delivery === 0 ? "text-emerald-700" : "text-ink"}`}>{deliveryLabel(delivery)}</dd>
        </div>
        {deliveryNote && <p className="text-xs leading-relaxed text-muted">{deliveryNote}</p>}
        <div className="flex items-baseline justify-between border-t border-line pt-4 text-lg">
          <dt className="font-bold text-navy-900">Total</dt>
          <dd className="text-right font-extrabold text-navy-900">
            {formatPKR(subtotal + (delivery ?? 0))}
            {delivery === null && <span className="block text-xs font-medium text-muted">+ delivery</span>}
          </dd>
        </div>
      </dl>
      {remaining > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted">
            Add <span className="font-semibold text-ink">{formatPKR(remaining)}</span> more for free delivery.
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, (subtotal / freeDeliveryMin) * 100)}%` }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
