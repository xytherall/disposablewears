import { PAYMENT_LABELS, deliveryLabel, formatPKR, orderLabel } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

// Emails the owner when a new order comes in, through Resend (free tier).
// Needs RESEND_API_KEY. Until a domain is verified in Resend, mail can only go
// to the address the Resend account was made with, from onboarding@resend.dev.

type Alert = {
  orderId: string;
  orderNo: number;
  to: string;
  customer: { name: string; phone: string; email: string; business_name: string; city: string; address: string; notes: string };
  lines: { product: string; variant: string; price: number; quantity: number }[];
  subtotal: number;
  delivery: number | null;
  total: number;
  paymentMethod: PaymentMethod;
  reference: string;
  hasProof: boolean;
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendOrderAlert(a: Alert) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_ALERT_EMAIL || a.to;
  if (!key || !to) return;

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const label = orderLabel(a.orderNo);
  const c = a.customer;
  const rows = a.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0">${esc(l.product)} · ${esc(l.variant)} × ${l.quantity}</td><td style="padding:6px 0;text-align:right">${formatPKR(l.price * l.quantity)}</td></tr>`,
    )
    .join("");
  const payment = [
    PAYMENT_LABELS[a.paymentMethod],
    a.reference && `Ref: ${esc(a.reference)}`,
    a.hasProof && "screenshot uploaded",
  ]
    .filter(Boolean)
    .join(" · ");

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0b1026;max-width:520px">
  <h2 style="margin:0 0 4px">New order ${label}</h2>
  <p style="margin:0 0 16px;color:#555">${formatPKR(a.total)} · ${payment}</p>
  <p style="margin:0 0 16px"><b>${esc(c.name)}</b>${c.business_name ? ` (${esc(c.business_name)})` : ""}<br>
  ${esc(c.phone)}${c.email ? ` · ${esc(c.email)}` : ""}<br>${esc(c.address)}, ${esc(c.city)}</p>
  ${c.notes ? `<p style="margin:0 0 16px">Note: ${esc(c.notes)}</p>` : ""}
  <table style="width:100%;border-collapse:collapse;border-top:1px solid #ddd">${rows}
  <tr><td style="padding:6px 0;border-top:1px solid #ddd">Delivery</td><td style="padding:6px 0;border-top:1px solid #ddd;text-align:right">${deliveryLabel(a.delivery)}</td></tr>
  <tr><td style="padding:6px 0"><b>Total</b></td><td style="padding:6px 0;text-align:right"><b>${formatPKR(a.total)}</b></td></tr></table>
  ${site ? `<p style="margin:20px 0 0"><a href="${site}/admin/orders/${a.orderId}" style="background:#2a44ff;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Open in admin</a></p>` : ""}
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ORDER_ALERT_FROM || "Disposable Wears <onboarding@resend.dev>",
        to: [to],
        subject: `New order ${label} · ${formatPKR(a.total)} · ${c.name}`,
        html,
        ...(c.email ? { reply_to: c.email } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("order alert", res.status, await res.text());
  } catch (e) {
    // Never fail the order because the alert didn't go out.
    console.error("order alert", e);
  }
}
