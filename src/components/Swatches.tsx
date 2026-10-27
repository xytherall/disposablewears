const COLORS: Record<string, string> = {
  blue: "#3b72e6",
  black: "#2c3140",
  white: "#ffffff",
  transparent: "linear-gradient(135deg, #f8fbff 0%, #dbe6fb 100%)",
};

export function swatchFor(name: string) {
  const key = Object.keys(COLORS).find((k) => name.toLowerCase().includes(k));
  return key ? COLORS[key] : null;
}

export function Swatches({ names }: { names: string[] }) {
  const unique = [...new Set(names.map(swatchFor).filter(Boolean))] as string[];
  if (unique.length === 0) return null;
  return (
    <div className="flex -space-x-1.5" aria-hidden>
      {unique.map((c) => (
        <span key={c} className="h-5 w-5 rounded-full border-2 border-white ring-1 ring-line" style={{ background: c }} />
      ))}
    </div>
  );
}
