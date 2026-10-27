export function PageHero({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="bg-lab relative -mt-20 overflow-hidden pt-20">
      <div className="pointer-events-none absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-volt/20 blur-[110px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[320px] w-[320px] rounded-full bg-sky-300/30 blur-[110px]" aria-hidden />
      <div className="container-page relative pt-12 pb-14 sm:pt-16 sm:pb-20">
        {eyebrow && <p className="tag animate-fade-up text-volt">{eyebrow}</p>}
        <h1 className="animate-fade-up delay-1 mt-4 text-5xl leading-[0.92] font-extrabold tracking-[-0.045em] text-night sm:text-7xl">
          {title}
          <span className="text-volt">.</span>
        </h1>
        {text && <p className="animate-fade-up delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-night/65">{text}</p>}
      </div>
    </section>
  );
}
