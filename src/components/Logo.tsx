// Recreation of the Disposable Wears logo from the flyer: a scrub top above
// "DW". Swap for the official file when the owner sends it.
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Disposable Wears logo">
      <defs>
        <linearGradient id="dw-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path
        d="M21 3 L11 7.5 L4 17 L11.5 22 L15 17 L15 34 L49 34 L49 17 L52.5 22 L60 17 L53 7.5 L43 3 Q38.5 10 32 10.5 Q25.5 10 21 3 Z"
        fill="url(#dw-shirt)"
      />
      <path d="M25 4.5 L32 14 L39 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
      <text
        x="32"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-sans), Arial, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="-1.5"
        fill="#1e2a78"
      >
        DW
      </text>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={light ? "rounded-xl bg-white p-1" : ""}>
        <LogoMark className="h-10 w-10" />
      </span>
      <span className={`leading-[1.05] font-extrabold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
        <span className="block text-[17px]">Disposable</span>
        <span className="block text-[17px]">Wears</span>
      </span>
    </span>
  );
}
