import Link from "next/link";

export function PageTitle({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</div>;
}

const TONES = {
  gray: "bg-slate-100 text-slate-700",
  blue: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-800",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  navy: "bg-navy-900 text-white",
} as const;

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${TONES[tone]}`}>{children}</span>;
}

export const ORDER_STATUS: Record<string, { label: string; tone: keyof typeof TONES }> = {
  pending: { label: "New", tone: "amber" },
  confirmed: { label: "Confirmed", tone: "blue" },
  shipped: { label: "Shipped", tone: "navy" },
  delivered: { label: "Delivered", tone: "green" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const PAYMENT_STATUS: Record<string, { label: string; tone: keyof typeof TONES }> = {
  unpaid: { label: "Unpaid", tone: "gray" },
  pending_verification: { label: "Check payment", tone: "amber" },
  paid: { label: "Paid", tone: "green" },
  refunded: { label: "Refunded", tone: "red" },
};

export const QUOTE_STATUS: Record<string, { label: string; tone: keyof typeof TONES }> = {
  new: { label: "New", tone: "amber" },
  contacted: { label: "Contacted", tone: "blue" },
  won: { label: "Won", tone: "green" },
  lost: { label: "Lost", tone: "gray" },
};

export function Tabs({ tabs, active }: { tabs: { href: string; label: string; key: string; count?: number }[]; active: string }) {
  return (
    <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold whitespace-nowrap ${
            active === t.key ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-ink hover:border-brand-500"
          }`}
        >
          {t.label}
          {t.count !== undefined && <span className={active === t.key ? "text-blue-200" : "text-muted"}> ({t.count})</span>}
        </Link>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-muted">{children}</div>;
}

export function Notice({ tone = "green", children }: { tone?: "green" | "red"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "red" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm font-medium ${tone === "red" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
    >
      {children}
    </p>
  );
}
