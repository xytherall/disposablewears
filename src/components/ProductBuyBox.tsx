"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryName } from "@/lib/catalog";
import { formatPKR, whatsappLink } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { CartIcon, CheckIcon, WhatsAppIcon } from "./Icons";
import { ProductImage } from "./ProductArt";
import { QuantityStepper } from "./QuantityStepper";
import { swatchFor } from "./Swatches";

export function ProductBuyBox({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const firstInStock = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstInStock?.id);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const soldOut = !variant || variant.stock <= 0;
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  function addToCart() {
    if (!variant || soldOut) return;
    add({
      variantId: variant.id,
      slug: product.slug,
      productName: product.name,
      variantName: variant.name,
      unit: product.unit,
      price: variant.price,
      quantity: qty,
      art: product.art,
      imageUrl: product.image_url,
    });
    setAdded(`${qty} × ${product.name}${product.variants.length > 1 ? ` (${variant.name})` : ""}`);
  }

  const message =
    `Hi Disposable Wears, I'd like to order:\n` +
    `${product.name}${variant ? ` (${variant.name})` : ""}\n` +
    `Quantity: ${qty} × ${product.unit}\n` +
    (variant ? `Total: ${formatPKR(variant.price * qty)}` : "");

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-brand-50">
        <ProductImage product={product} variant={variant?.name} className="aspect-square w-full" />
      </div>

      <div className="flex flex-col">
        <p className="text-sm font-bold tracking-wider text-brand-600 uppercase">{categoryName(product.category)}</p>
        <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-navy-900 sm:text-4xl">{product.name}</h1>
        <p className="mt-3 text-lg text-muted">{product.short_description}</p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold text-navy-900">{variant ? formatPKR(variant.price) : "—"}</span>
          <span className="text-muted">/ {product.unit}</span>
        </div>

        {product.variants.length > 1 && (
          <fieldset className="mt-8">
            <legend className="text-sm font-semibold text-ink">
              Option: <span className="font-normal text-muted">{variant?.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const selected = v.id === variant?.id;
                const swatch = swatchFor(v.name);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "border-brand-600 bg-brand-50 text-brand-700 ring-4 ring-brand-100"
                        : "border-line text-ink hover:border-brand-500"
                    } ${v.stock <= 0 ? "opacity-50" : ""}`}
                  >
                    {swatch && <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: swatch }} />}
                    {v.name}
                    {new Set(product.variants.map((x) => x.price)).size > 1 && (
                      <span className="font-normal text-muted">{formatPKR(v.price)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-8">
          <p className="text-sm font-semibold text-ink">Quantity</p>
          <div className="mt-3 flex items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} />
            {variant && (
              <p className="text-muted">
                Total <span className="text-lg font-bold text-navy-900">{formatPKR(variant.price * qty)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button type="button" onClick={addToCart} disabled={soldOut} className="btn-primary w-full py-4 text-base">
            <CartIcon className="h-5 w-5" /> {soldOut ? "Out of stock" : "Add to cart"}
          </button>
          {added && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm" role="status">
              <span className="flex items-center gap-2 font-medium text-emerald-800">
                <CheckIcon className="h-4 w-4" /> Added {added}
              </span>
              <Link href="/cart" className="font-bold text-brand-700 hover:underline">
                View cart & checkout →
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(whatsapp, message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={soldOut}
              className={`btn-whatsapp flex-1 ${soldOut ? "pointer-events-none opacity-60" : ""}`}
            >
              <WhatsAppIcon className="h-5 w-5" /> Order on WhatsApp
            </a>
            <Link href={`/bulk-orders?product=${product.slug}`} className="btn-outline flex-1">
              Need bulk? Get a quote
            </Link>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">Free delivery in Lahore · Cash on Delivery · Delivery all over Pakistan</p>
      </div>
    </div>
  );
}
