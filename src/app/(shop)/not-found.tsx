import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center">
      <p className="text-sm font-bold tracking-wider text-brand-600 uppercase">404</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy-900">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved, or the link may be wrong.</p>
      <Link href="/products" className="btn-primary mt-8">Browse products</Link>
    </div>
  );
}
