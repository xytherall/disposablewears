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
    <div className={`reveal ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {eyebrow && <p className="tag text-volt">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl leading-[0.98] font-extrabold tracking-[-0.04em] text-night sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-relaxed text-night/65">{text}</p>}
    </div>
  );
}
