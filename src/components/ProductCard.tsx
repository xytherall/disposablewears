import Link from "next/link";
import { categoryName } from "@/lib/catalog";
import { formatPKR, lowestPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ArrowRightIcon } from "./Icons";
import { ProductImage } from "./ProductArt";
import { Swatches } from "./Swatches";

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const prices = product.variants.map((v) => v.price);
  const from = lowestPrice(prices);
  const varies = new Set(prices).size > 1;
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-night/[0.06] bg-ice transition duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(42,68,255,0.45)]"
    >
      <div className="flex items-start justify-between gap-2 px-3.5 pt-3.5 sm:px-5 sm:pt-5">
        <span className="tag text-night/40">{index !== undefined ? `DW-${String(index + 1).padStart(2, "0")}` : ""}</span>
        <span className="tag hidden max-w-[65%] truncate rounded-full bg-white px-2.5 py-1 text-night/70 shadow-sm sm:inline">{product.unit}</span>
      </div>

      <div className="relative mx-auto aspect-square w-full p-5 sm:p-8">
        <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-volt/20 to-sky-200/40 blur-2xl transition duration-500 group-hover:from-volt/35" aria-hidden />
        <ProductImage
          product={product}
          variant={product.variants[0]?.name}
          bare
          className="float-item relative h-full w-full transition duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:-rotate-3"
        />
        {!inStock && (
          <span className="tag absolute top-2 right-3 rounded-full bg-red-600 px-2.5 py-1 text-white">Sold out</span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 sm:px-5 sm:pb-5">
        <p className="tag hidden text-volt sm:block">{categoryName(product.category)}</p>
        <h3 className="font-display text-base leading-tight font-bold tracking-tight text-night sm:mt-1.5 sm:text-xl">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-night">
              {varies && <span className="mr-1 text-xs text-night/50">from</span>}
              <span className="font-display text-lg font-bold tracking-tight sm:text-2xl">{formatPKR(from)}</span>
            </p>
            <div className="mt-1.5">
              <Swatches names={product.variants.map((v) => v.name)} />
            </div>
          </div>
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night text-white transition duration-300 group-hover:bg-volt group-hover:-rotate-45 sm:flex">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
