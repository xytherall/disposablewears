"use client";

import { useActionState } from "react";
import { changePassword, type ActionState } from "@/app/admin/actions";
import { Card, Notice } from "./ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePassword, {});
  return (
    <Card>
      <form action={action} className="space-y-4">
        <h2 className="text-lg font-bold text-navy-900">Change password</h2>
        {state.error && <Notice tone="red">{state.error}</Notice>}
        {state.message && <Notice>{state.message}</Notice>}
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input id="password" name="password" type="password" className="field" minLength={8} required autoComplete="new-password" />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Type it again</label>
          <input id="confirm" name="confirm" type="password" className="field" minLength={8} required autoComplete="new-password" />
        </div>
        <button type="submit" disabled={pending} className="btn-primary px-6 py-3">
          {pending ? "Saving…" : "Change password"}
        </button>
      </form>
    </Card>
  );
}
