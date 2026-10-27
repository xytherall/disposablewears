"use client";

import { useTransition } from "react";
import { setProductActive } from "@/app/admin/actions";

export function ProductActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => setProductActive(id, !active))}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } ${pending ? "opacity-50" : ""}`}
      title={active ? "Showing in the shop. Click to hide." : "Hidden from the shop. Click to show."}
    >
      {active ? "● Showing" : "○ Hidden"}
    </button>
  );
}
