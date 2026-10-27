import Link from "next/link";
import { categoryName } from "@/lib/catalog";
import { formatPKR, lowestPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductArt";
import { Swatches } from "./Swatches";

export function ProductCard({ product }: { product: Product }) {
  const prices = product.variants.map((v) => v.price);
  const from = lowestPrice(prices);
  const varies = new Set(prices).size > 1;
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-600/10"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          product={product}
          variant={product.variants[0]?.name}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] sm:top-3 sm:left-3 sm:px-3 sm:text-xs font-semibold text-navy-900 shadow-sm backdrop-blur">
          {product.unit}
        </span>
        {!inStock && (
          <span className="absolute top-3 right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="hidden text-xs font-semibold tracking-wide text-brand-600 uppercase sm:block">{categoryName(product.category)}</p>
        <h3 className="text-[15px] leading-snug font-bold sm:mt-1.5 sm:text-lg text-navy-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 hidden text-sm text-muted sm:block">{product.short_description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-navy-900">
            {varies && <span className="mr-1 text-xs font-medium text-muted">from</span>}
            <span className="text-lg font-extrabold sm:text-xl">{formatPKR(from)}</span>
          </p>
          <Swatches names={product.variants.map((v) => v.name)} />
        </div>
      </div>
    </Link>
  );
}
