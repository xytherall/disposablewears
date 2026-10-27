"use client";

import { useActionState, useState } from "react";
import { sendPasswordReset, signIn, type AuthState } from "@/app/admin/login/actions";

export function LoginForm({ notice }: { notice?: string }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loginState, loginAction, loggingIn] = useActionState<AuthState, FormData>(signIn, {});
  const [resetState, resetAction, resetting] = useActionState<AuthState, FormData>(sendPasswordReset, {});
  const state = mode === "login" ? loginState : resetState;

  return (
    <form action={mode === "login" ? loginAction : resetAction} className="mt-8 space-y-4">
      {notice && !state.error && !state.message && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{state.error}</p>}
      {state.message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{state.message}</p>}

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="field" required autoComplete="email" />
      </div>
      {mode === "login" && (
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="field" required autoComplete="current-password" />
        </div>
      )}

      <button type="submit" className="btn-primary w-full py-3.5" disabled={loggingIn || resetting}>
        {mode === "login" ? (loggingIn ? "Logging in…" : "Log in") : resetting ? "Sending…" : "Send reset link"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "reset" : "login")}
        className="w-full text-center text-sm font-semibold text-muted hover:text-navy-900"
      >
        {mode === "login" ? "Forgot your password?" : "← Back to log in"}
      </button>
    </form>
  );
}
