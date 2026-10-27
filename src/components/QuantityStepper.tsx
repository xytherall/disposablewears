"use client";

export function QuantityStepper({ value, onChange, small = false }: { value: number; onChange: (n: number) => void; small?: boolean }) {
  const size = small ? "h-9 w-9 text-lg" : "h-12 w-12 text-xl";
  return (
    <div className="flex items-center rounded-xl border border-line">
      <button type="button" className={`${size} text-navy-900 hover:bg-brand-50`} onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity">
        −
      </button>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className={`${small ? "h-9 w-11 text-sm" : "h-12 w-16"} border-x border-line text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Quantity"
      />
      <button type="button" className={`${size} text-navy-900 hover:bg-brand-50`} onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
