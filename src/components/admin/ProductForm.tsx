"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteProduct, saveProduct, type ActionState } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { TrashIcon } from "../Icons";
import { ProductArt } from "../ProductArt";
import { Card, Notice } from "./ui";

const ARTS = [
  ["bedsheet", "Bed sheet"],
  ["couch", "Couch cover"],
  ["gown", "Gown"],
  ["scrubs", "Gown + trouser"],
  ["spa", "Spa gown"],
  ["cap", "Cap"],
  ["shoe", "Shoe cover"],
  ["mask", "Mask"],
  ["gloves", "Gloves"],
  ["apron", "Apron"],
  ["barber", "Barber cape"],
] as const;

type Row = { key: string; id?: string; name: string; price: string; stock: string };

let rowKey = 0;
const newRow = (r: Partial<Row> = {}): Row => ({ key: `r${rowKey++}`, name: "", price: "", stock: "100", ...r });

export function ProductForm({ product, justCreated }: { product: Product | null; justCreated?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProduct.bind(null, product?.id ?? null), {});
  const [rows, setRows] = useState<Row[]>(() =>
    product?.variants.length
      ? product.variants.map((v) => newRow({ id: v.id, name: v.name, price: String(v.price), stock: String(v.stock) }))
      : [newRow()],
  );
  const [art, setArt] = useState(product?.art ?? "bedsheet");
  const [preview, setPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [deleting, startDelete] = useTransition();

  const update = (key: string, field: keyof Row, value: string) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  const currentImage = removePhoto ? null : (preview ?? product?.image_url ?? null);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <input
        type="hidden"
        name="variants"
        value={JSON.stringify(rows.map((r) => ({ id: r.id, name: r.name, price: r.price, stock: r.stock })))}
      />

      <div className="min-w-0 space-y-6">
        {justCreated && !state.error && !state.message && <Notice>Product created. It&apos;s now in the shop.</Notice>}
        {state.error && <Notice tone="red">{state.error}</Notice>}
        {state.message && <Notice>{state.message}</Notice>}

        <Card>
          <h2 className="mb-4 text-lg font-bold text-navy-900">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Product name</label>
              <input id="name" name="name" className="field" required defaultValue={product?.name} />
            </div>
            <div>
              <label className="label" htmlFor="category">Category</label>
              <select id="category" name="category" className="field" defaultValue={product?.category ?? CATEGORIES[0].slug}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="unit">Sold as</label>
              <input id="unit" name="unit" className="field" defaultValue={product?.unit ?? "1 piece"} placeholder="e.g. Pack of 100" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="short_description">Short description <span className="font-normal text-muted">(shown on product cards)</span></label>
              <input id="short_description" name="short_description" className="field" defaultValue={product?.short_description} maxLength={300} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Full description</label>
              <textarea id="description" name="description" className="field min-h-28" defaultValue={product?.description} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="features">Key features <span className="font-normal text-muted">(one per line)</span></label>
              <textarea id="features" name="features" className="field min-h-28" defaultValue={product?.features.join("\n")} placeholder={"Lightweight\nBreathable\nSingle use"} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy-900">Options, prices & stock</h2>
          <p className="mt-1 mb-4 text-sm text-muted">One row per colour, size or type. Customers pick one on the product page.</p>
          <div className="space-y-3">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_auto] gap-3 px-1 text-xs font-semibold text-muted uppercase sm:grid">
              <span>Option name</span><span>Price (Rs)</span><span>In stock</span><span className="w-9" />
            </div>
            {rows.map((r) => (
              <div key={r.key} className="grid grid-cols-2 gap-3 rounded-xl border border-line p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center sm:border-0 sm:p-0">
                <input className="field col-span-2 sm:col-span-1" placeholder="e.g. Blue" value={r.name} onChange={(e) => update(r.key, "name", e.target.value)} aria-label="Option name" />
                <input className="field" inputMode="numeric" placeholder="Price" value={r.price} onChange={(e) => update(r.key, "price", e.target.value)} aria-label="Price" />
                <input className="field" inputMode="numeric" placeholder="Stock" value={r.stock} onChange={(e) => update(r.key, "stock", e.target.value)} aria-label="Stock" />
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                  disabled={rows.length === 1}
                  className="col-span-2 justify-self-end rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30 sm:col-span-1"
                  aria-label="Remove option"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setRows((rs) => [...rs, newRow()])} className="btn-outline mt-4 px-4 py-2 text-sm">
            + Add option
          </button>
        </Card>
      </div>

      <div className="min-w-0 space-y-6">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-navy-900">Photo</h2>
          <div className="overflow-hidden rounded-xl border border-line">
            {currentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentImage} alt="" className="aspect-square w-full object-cover" />
            ) : (
              <ProductArt art={art} variant={rows[0]?.name} label="" className="block aspect-square w-full" />
            )}
          </div>
          <label className="label mt-4" htmlFor="photo">Upload a photo <span className="font-normal text-muted">(JPG/PNG, square looks best)</span></label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
              setRemovePhoto(false);
            }}
            className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:font-semibold file:text-white"
          />
          {product?.image_url && (
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" name="remove_photo" checked={removePhoto} onChange={(e) => setRemovePhoto(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Remove photo and use the drawing
            </label>
          )}
          <label className="label mt-4" htmlFor="art">Drawing used when there&apos;s no photo</label>
          <select id="art" name="art" className="field" value={art} onChange={(e) => setArt(e.target.value)}>
            {ARTS.map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold text-navy-900">Visibility</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-5 w-5 accent-brand-600" />
              <span><span className="font-semibold">Show in shop</span><span className="block text-sm text-muted">Untick to hide it without deleting.</span></span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-5 w-5 accent-brand-600" />
              <span><span className="font-semibold">Show on home page</span><span className="block text-sm text-muted">Appears under "Our products" on the home page.</span></span>
            </label>
            <div>
              <label className="label" htmlFor="sort">Order in list <span className="font-normal text-muted">(lower shows first)</span></label>
              <input id="sort" name="sort" inputMode="numeric" className="field" defaultValue={product?.sort ?? 0} />
            </div>
            <div>
              <label className="label" htmlFor="slug">Web address <span className="font-normal text-muted">(optional)</span></label>
              <input id="slug" name="slug" className="field" defaultValue={product?.slug} placeholder="made from the name" />
            </div>
          </div>
        </Card>

        <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>

        {product && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (confirm(`Delete "${product.name}" for good? Past orders keep their details. To just hide it, untick "Show in shop" instead.`)) {
                startDelete(() => deleteProduct(product.id));
              }
            }}
            className="w-full text-center text-sm font-semibold text-red-600 hover:underline"
          >
            {deleting ? "Deleting…" : "Delete product"}
          </button>
        )}
      </div>
    </form>
  );
}
