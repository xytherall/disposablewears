export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-sm font-bold tracking-wider text-brand-600 uppercase">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-navy-900 sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p>}
    </div>
  );
}
