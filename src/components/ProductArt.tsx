// Simple drawings used in place of product photos until the owner uploads
// real ones from the admin panel. The drawing takes the colour of the
// selected variant (Blue, Black, White, Transparent).

type Palette = { fill: string; shade: string; line: string };

const PALETTES: Record<string, Palette> = {
  blue: { fill: "#3b72e6", shade: "#2a59c4", line: "#1b3f99" },
  black: { fill: "#2c3140", shade: "#1d212c", line: "#0f121a" },
  white: { fill: "#ffffff", shade: "#e6ecf7", line: "#9fb0cf" },
  transparent: { fill: "rgba(255,255,255,0.55)", shade: "rgba(214,226,247,0.7)", line: "#7f9ccf" },
};

export function paletteFor(variantName?: string): Palette {
  const v = (variantName ?? "").toLowerCase();
  if (v.includes("black")) return PALETTES.black;
  if (v.includes("white")) return PALETTES.white;
  if (v.includes("transparent")) return PALETTES.transparent;
  return PALETTES.blue;
}

function Drawing({ art, p }: { art: string; p: Palette }) {
  const s = { stroke: p.line, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (art) {
    case "bedsheet":
      return (
        <g>
          <rect x="30" y="118" width="6" height="40" rx="2" fill="#8b98ad" />
          <rect x="164" y="118" width="6" height="40" rx="2" fill="#8b98ad" />
          <path d="M24 92 h152 v28 a6 6 0 0 1 -6 6 h-140 a6 6 0 0 1 -6 -6 z" fill={p.fill} {...s} />
          <path d="M24 108 q20 10 38 0 t38 0 t38 0 t38 0" fill="none" {...s} strokeWidth={1.8} opacity={0.6} />
          <rect x="34" y="72" width="54" height="24" rx="11" fill={p.shade} {...s} />
        </g>
      );
    case "couch":
      return (
        <g>
          <path d="M44 120 l-10 40 M156 120 l10 40 M70 122 l-4 38 M130 122 l4 38" stroke="#8b98ad" strokeWidth={5} strokeLinecap="round" />
          <path d="M22 96 h156 a4 4 0 0 1 4 4 v12 q-80 18 -164 0 v-12 a4 4 0 0 1 4 -4 z" fill={p.fill} {...s} />
          <path d="M18 112 q82 18 164 0" fill="none" {...s} strokeDasharray="4 5" />
          <ellipse cx="150" cy="88" rx="22" ry="8" fill={p.shade} {...s} />
        </g>
      );
    case "gown":
      return (
        <g>
          <path
            d="M78 34 q22 14 44 0 l30 14 l22 58 l-18 7 l-14 -36 v95 h-84 v-95 l-14 36 l-18 -7 l22 -58 z"
            fill={p.fill}
            {...s}
          />
          <path d="M78 34 q22 22 44 0" fill={p.shade} {...s} />
          <path d="M70 120 h60" {...s} fill="none" strokeDasharray="5 5" />
          <path d="M100 52 v116" {...s} fill="none" opacity={0.45} />
        </g>
      );
    case "scrubs":
      return (
        <g>
          <path d="M70 26 q18 10 36 0 l24 10 l14 34 l-15 6 l-9 -18 v44 h-64 v-44 l-9 18 l-15 -6 l14 -34 z" fill={p.fill} {...s} />
          <path d="M80 28 l8 18 l8 -18" fill="none" {...s} />
          <path d="M66 104 h68 l4 72 h-28 l-10 -50 l-10 50 h-28 z" fill={p.shade} {...s} />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M40 116 q-6 -66 60 -70 q66 4 60 70 z" fill={p.fill} {...s} />
          <path d="M58 70 q10 26 4 46 M80 54 q8 30 4 62 M100 50 v66 M120 54 q-8 30 -4 62 M142 70 q-10 26 -4 46" fill="none" {...s} strokeWidth={1.6} opacity={0.55} />
          <path d="M36 116 q64 22 128 0 q0 12 -6 14 q-58 18 -116 0 q-6 -2 -6 -14 z" fill={p.shade} {...s} />
          <path d="M44 124 q4 3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" fill="none" {...s} strokeWidth={1.4} />
        </g>
      );
    case "shoe":
      return (
        <g>
          <path d="M44 74 q10 -10 40 -6 q6 30 30 36 q38 6 48 26 q4 16 -12 22 h-96 q-16 -2 -16 -16 z" fill={p.fill} {...s} />
          <path d="M44 74 q20 8 40 -6" fill="none" {...s} />
          <path d="M42 140 h112" {...s} fill="none" strokeDasharray="3 6" />
          <path d="M42 80 q4 3 8 0 t8 0 t8 0 t8 0 t8 0" fill="none" {...s} strokeWidth={1.4} />
        </g>
      );
    case "mask":
      return (
        <g>
          <path d="M52 78 q-30 2 -30 26 q0 26 34 26" fill="none" {...s} strokeWidth={3} />
          <path d="M148 78 q30 2 30 26 q0 26 -34 26" fill="none" {...s} strokeWidth={3} />
          <path d="M50 70 q50 -14 100 0 v58 q-50 22 -100 0 z" fill={p.fill} {...s} />
          <path d="M50 88 q50 -10 100 0 M50 104 q50 -10 100 0 M50 120 q50 -10 100 0" fill="none" {...s} strokeWidth={1.8} opacity={0.6} />
          <path d="M80 66 q20 -4 40 0" fill="none" stroke="#c9d3e3" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    case "gloves":
      return (
        <g transform="translate(18 26) scale(0.82)">
          <path
            d="M74 168 v-40 l-22 -34 a8 8 0 0 1 13 -9 l17 22 v-62 a8 8 0 0 1 16 0 v48 v-60 a8 8 0 0 1 16 0 v60 v-52 a8 8 0 0 1 16 0 v54 v-40 a8 8 0 0 1 16 0 v64 q0 26 -18 39 v10 z"
            fill={p.fill}
            {...s}
          />
          <path d="M74 158 h62" fill="none" {...s} strokeDasharray="4 5" />
        </g>
      );
    case "spa":
      return (
        <g>
          <path d="M60 40 q40 -10 80 0 l6 132 q-46 10 -92 0 z" fill={p.fill} {...s} />
          <path d="M60 40 q22 30 50 34 q-8 50 -40 98" fill="none" {...s} />
          <path d="M66 46 q34 -8 68 0" fill="none" {...s} strokeWidth={4} opacity={0.5} />
          <path d="M140 40 l18 -14 M60 40 l-18 -14" {...s} />
          <path d="M58 104 h86" {...s} strokeDasharray="5 5" fill="none" />
        </g>
      );
    case "apron":
      return (
        <g>
          <path d="M78 52 q22 -34 44 0" fill="none" {...s} strokeWidth={3} />
          <path d="M76 52 h48 v30 q14 4 26 0 v86 q-50 10 -100 0 v-86 q12 4 26 0 z" fill={p.fill} {...s} />
          <path d="M50 84 l-24 20 M150 84 l24 20" {...s} strokeWidth={3} />
          <rect x="80" y="112" width="40" height="26" rx="4" fill={p.shade} {...s} />
        </g>
      );
    case "barber":
      return (
        <g>
          <circle cx="100" cy="46" r="20" fill="#e9c9a8" stroke="#b08766" strokeWidth={2} />
          <path d="M80 70 q20 10 40 0 l52 94 q-72 18 -144 0 z" fill={p.fill} {...s} />
          <path d="M80 70 q20 14 40 0" fill={p.shade} {...s} />
          <path d="M100 82 v84 M70 100 l-20 60 M130 100 l20 60" fill="none" {...s} strokeWidth={1.6} opacity={0.5} />
        </g>
      );
    default:
      return (
        <g>
          <rect x="50" y="56" width="100" height="96" rx="14" fill={p.fill} {...s} />
          <path d="M70 92 h60 M70 112 h40" {...s} />
        </g>
      );
  }
}

export function ProductArt({
  art,
  variant,
  className = "",
  label,
}: {
  art: string | null;
  variant?: string;
  className?: string;
  label: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={label}>
      <defs>
        <radialGradient id="art-bg" cx="50%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f3f7ff" />
          <stop offset="1" stopColor="#dbe6fb" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#art-bg)" />
      <ellipse cx="100" cy="176" rx="70" ry="7" fill="#1e2a78" opacity="0.08" />
      <Drawing art={art ?? ""} p={paletteFor(variant)} />
    </svg>
  );
}

export function ProductImage({
  product,
  variant,
  className = "",
}: {
  product: { name: string; art: string | null; image_url: string | null };
  variant?: string;
  className?: string;
}) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image_url} alt={product.name} className={`object-cover ${className}`} />;
  }
  return <ProductArt art={product.art} variant={variant} label={product.name} className={className} />;
}
