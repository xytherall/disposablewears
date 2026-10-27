"use client";

import { useActionState } from "react";
import { updateOrder, type ActionState } from "@/app/admin/actions";
import type { Order } from "@/lib/types";
import { Card, Notice, ORDER_STATUS, PAYMENT_STATUS } from "./ui";

export function OrderEditForm({ order }: { order: Order }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateOrder.bind(null, order.id), {});

  return (
    <Card>
      <form action={action} className="space-y-4">
        <h2 className="text-lg font-bold text-navy-900">Update order</h2>
        {state.error && <Notice tone="red">{state.error}</Notice>}
        {state.message && <Notice>{state.message}</Notice>}

        <div>
          <label className="label" htmlFor="status">Order status</label>
          <select id="status" name="status" className="field" defaultValue={order.status}>
            {Object.entries(ORDER_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Cancelling puts the items back in stock.</p>
        </div>

        <div>
          <label className="label" htmlFor="payment_status">Payment</label>
          <select id="payment_status" name="payment_status" className="field" defaultValue={order.payment_status}>
            {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="delivery_fee">Delivery charge (Rs)</label>
          <input
            id="delivery_fee"
            name="delivery_fee"
            inputMode="numeric"
            className="field"
            defaultValue={order.delivery_fee ?? ""}
            placeholder="Leave empty if not decided yet"
          />
          <p className="mt-1 text-xs text-muted">Enter 0 for free delivery. The total updates when you save.</p>
        </div>

        <div>
          <label className="label" htmlFor="admin_notes">Private notes</label>
          <textarea id="admin_notes" name="admin_notes" className="field min-h-24" defaultValue={order.admin_notes ?? ""} placeholder="Courier, tracking number, anything to remember…" />
        </div>

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </Card>
  );
}
