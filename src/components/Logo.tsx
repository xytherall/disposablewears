// The Disposable Wears logo, redrawn from the printed flyer: a scrub top
// above an interlocked "DW".
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 62" className={className} role="img" aria-label="Disposable Wears logo">
      <path
        d="M25 3 L16.5 5.5 L6 13.5 L11.5 21.5 L18.5 17.5 L18.5 34 L45.5 34 L45.5 17.5 L52.5 21.5 L58 13.5 L47.5 5.5 L39 3 Z"
        fill="#1f7ae6"
      />
      <path d="M25 3 L32 12 L39 3 Z" fill="#1559c7" />
      <path d="M25 3 L32 12 L39 3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      <path
        d="M3 35 H15 A12.5 12.5 0 0 1 15 60 H3 Z M10 41.5 V53.5 H15 A6 6 0 0 0 15 41.5 Z"
        fill="#232a6e"
        fillRule="evenodd"
      />
      <path d="M25 35 H32 L36.6 49.5 L41 37 H46 L50.4 49.5 L55 35 H62 L54 60 H47.4 L43.5 47.8 L39.6 60 H33 Z" fill="#232a6e" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={light ? "rounded-xl bg-white p-1" : ""}>
        <LogoMark className="h-9 w-9" />
      </span>
      <span className={`leading-[0.95] font-extrabold tracking-[-0.02em] ${light ? "text-white" : "text-[#232a6e]"}`}>
        <span className="block text-[16px]">Disposable</span>
        <span className="block text-[16px]">Wears</span>
      </span>
    </span>
  );
}
