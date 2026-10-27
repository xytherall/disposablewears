"use client";

import { useRef } from "react";

// Tilts its children in 3D as the pointer moves over the area. Children read
// --mx and --my (-1 to 1) to move by different depths.
export function Parallax({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  }
  function leave() {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={className} style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}>
      {children}
    </div>
  );
}

// One floating layer inside <Parallax>. Higher depth moves further.
export function Layer({
  depth,
  className = "",
  children,
}: {
  depth: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-transform duration-500 ease-out ${className}`}
      style={{
        transform: `translate3d(calc(var(--mx) * ${depth * 18}px), calc(var(--my) * ${depth * 14}px), 0) rotateX(calc(var(--my) * ${-depth * 3}deg)) rotateY(calc(var(--mx) * ${depth * 4}deg))`,
      }}
    >
      {children}
    </div>
  );
}
