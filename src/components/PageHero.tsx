export function PageHero({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" aria-hidden />
      <div className="container-page relative py-14 sm:py-16">
        {eyebrow && <p className="text-sm font-bold tracking-wider text-blue-300 uppercase">{eyebrow}</p>}
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-blue-100/85">{text}</p>}
      </div>
    </section>
  );
}
