import type { Product, StoreSettings } from "./types";

export const CATEGORIES = [
  { slug: "bed-couch", name: "Bed Sheets & Couch Covers" },
  { slug: "gowns", name: "Gowns" },
  { slug: "head-foot", name: "Caps & Shoe Covers" },
  { slug: "masks-gloves", name: "Masks & Gloves" },
  { slug: "aprons", name: "Aprons" },
] as const;

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsapp: "923001455129",
  phone: "+92 300 1455 129",
  email: "disposablewears.pk@gmail.com",
  address: "Ghazi Road, DHA, Lahore Cantt.",
  delivery_fee: 250,
  free_delivery_min: 5000,
  bank_name: "",
  bank_account_title: "",
  bank_account_no: "",
  bank_iban: "",
  jazzcash_no: "",
  jazzcash_name: "",
  easypaisa_no: "",
  easypaisa_name: "",
  announcement: "Delivery all over Pakistan · Cash on Delivery available",
};

type Seed = Omit<Product, "id" | "variants" | "active" | "image_url" | "sort"> & {
  variants: { name: string; price: number }[];
};

// The starting catalogue, taken from the owner's price list (October 2026).
// Used to fill the database the first time, and to show the shop before the
// database is connected.
const SEED: Seed[] = [
  {
    slug: "disposable-bed-sheet",
    name: "Disposable Bed Sheet with Pillow Cover",
    category: "bed-couch",
    short_description: "Single-use non-woven bed sheet with a matching pillow cover.",
    description:
      "A fresh, single-use bed sheet for every patient or client. Made from non-woven fabric, it keeps beds and treatment tables clean and saves you the laundry. Each piece comes with a matching pillow cover.",
    features: [
      "Fluid-resistant, single use",
      "Premium non-woven fabric",
      "Matching pillow cover included",
      "Zero laundry hassle",
      "Fast changes between patients",
    ],
    unit: "1 piece + pillow cover",
    art: "bedsheet",
    featured: true,
    variants: [
      { name: "Blue", price: 300 },
      { name: "Black", price: 300 },
      { name: "White", price: 300 },
    ],
  },
  {
    slug: "disposable-couch-cover",
    name: "Disposable Couch Cover",
    category: "bed-couch",
    short_description: "Fitted cover with elastic edges for treatment couches and massage tables.",
    description:
      "A fitted, single-use cover for treatment couches, facial beds and massage tables. The elastic edges hold it firmly in place so it doesn't slide while in use. Sold without a pillow cover.",
    features: ["Secure elastic edges", "Non-slip fit, zero sliding", "Quick setup", "Non-woven fabric"],
    unit: "1 piece",
    art: "couch",
    featured: true,
    variants: [
      { name: "Blue", price: 280 },
      { name: "Black", price: 280 },
      { name: "White", price: 280 },
    ],
  },
  {
    slug: "isolation-gown",
    name: "Isolation Gown",
    category: "gowns",
    short_description: "Lightweight non-woven gown with tie-back and adjustable waist.",
    description:
      "A lightweight, breathable gown that covers clothing during procedures, patient care and visits. It ties at the back and the waist can be adjusted for a comfortable fit.",
    features: ["Lightweight and breathable", "Non-woven fabric", "Easy tie-back", "Adjustable waist"],
    unit: "1 piece",
    art: "gown",
    featured: true,
    variants: [
      { name: "Blue", price: 280 },
      { name: "White", price: 280 },
    ],
  },
  {
    slug: "ot-gown-with-trouser",
    name: "OT Gown with Trouser",
    category: "gowns",
    short_description: "Disposable operation theatre gown that comes with a matching trouser.",
    description:
      "A disposable top and trouser set for operation theatres, procedure rooms and clinic staff. Wear once and throw away, with no washing or sterilising needed.",
    features: ["Top and trouser set", "Single use", "Lightweight non-woven fabric", "Comfortable fit"],
    unit: "1 set (gown + trouser)",
    art: "scrubs",
    featured: false,
    variants: [
      { name: "Blue", price: 300 },
      { name: "White", price: 300 },
    ],
  },
  {
    slug: "bouffant-cap",
    name: "Bouffant Cap",
    category: "head-foot",
    short_description: "Elastic hair cover for clinics, salons and kitchens. Pack of 100.",
    description:
      "A soft, breathable cap that keeps hair fully covered. The elastic band fits all head sizes. Used in hospitals, salons, spas and food preparation.",
    features: ["Lightweight and breathable", "Elastic fit", "Full hair coverage", "100 caps per pack"],
    unit: "Pack of 100",
    art: "cap",
    featured: true,
    variants: [{ name: "Blue", price: 300 }],
  },
  {
    slug: "shoe-cover",
    name: "Shoe Cover",
    category: "head-foot",
    short_description: "Anti-skid disposable shoe covers. Pack of 100 pieces (50 pairs).",
    description:
      "Slip-on covers that keep floors clean and keep dirt out of clean areas. Useful for operation theatres, clinics, labs, salons and homes.",
    features: ["Anti-skid", "Durable", "Comfortable fit", "Keeps floors clean", "100 pieces (50 pairs) per pack"],
    unit: "Pack of 100 (50 pairs)",
    art: "shoe",
    featured: true,
    variants: [{ name: "Blue", price: 390 }],
  },
  {
    slug: "face-mask",
    name: "Face Mask",
    category: "masks-gloves",
    short_description: "Disposable face masks with ear loops. Box of 50.",
    description:
      "Comfortable single-use face masks with soft ear loops, for daily protection at clinics, salons, offices and kitchens.",
    features: ["Hygienic protection", "Comfortable ear loops", "Single-use design", "50 masks per box"],
    unit: "Box of 50",
    art: "mask",
    featured: true,
    variants: [
      { name: "Blue", price: 230 },
      { name: "Black", price: 160 },
    ],
  },
  {
    slug: "disposable-gloves",
    name: "Disposable Plastic Gloves",
    category: "masks-gloves",
    short_description: "Transparent plastic gloves. Pack of 100 pieces (50 pairs).",
    description:
      "Lightweight transparent plastic gloves for food handling, cleaning, hair colouring and general hygiene tasks.",
    features: ["Lightweight plastic", "Transparent", "Single use", "100 pieces (50 pairs) per pack"],
    unit: "Pack of 100 (50 pairs)",
    art: "gloves",
    featured: true,
    variants: [{ name: "Transparent", price: 95 }],
  },
  {
    slug: "spa-gown",
    name: "Spa Gown",
    category: "gowns",
    short_description: "Black disposable gown for spa and salon clients. Male and female cuts.",
    description:
      "A comfortable single-use gown for spa, massage and salon clients. Available in separate male and female cuts.",
    features: ["Breathable non-woven fabric", "Comfortable", "Single use", "Male and female cuts"],
    unit: "1 piece",
    art: "spa",
    featured: true,
    variants: [
      { name: "Black · Female", price: 190 },
      { name: "Black · Male", price: 230 },
    ],
  },
  {
    slug: "chef-apron",
    name: "Chef Apron",
    category: "aprons",
    short_description: "Disposable apron that protects clothing during food handling.",
    description:
      "A single-use apron for kitchens, bakeries and food counters. Protects clothing from spills and keeps food handling hygienic.",
    features: ["Protects clothing", "Hygienic for food handling", "Lightweight", "Single use"],
    unit: "1 piece",
    art: "apron",
    featured: false,
    variants: [
      { name: "White", price: 170 },
      { name: "Blue", price: 170 },
    ],
  },
  {
    slug: "barber-apron",
    name: "Barber Apron",
    category: "aprons",
    short_description: "Disposable cape for haircuts, colouring and salon treatments.",
    description:
      "A single-use cape that keeps hair and colour off your clients' clothes. A new one for every client keeps your salon clean.",
    features: ["Keeps hair and colour off clothes", "Fresh for every client", "Lightweight", "Single use"],
    unit: "1 piece",
    art: "barber",
    featured: false,
    variants: [
      { name: "Black", price: 170 },
      { name: "White", price: 170 },
      { name: "Blue", price: 170 },
    ],
  },
];

export const SEED_STOCK = 1000;

export const SEED_PRODUCTS: Product[] = SEED.map((p, i) => ({
  ...p,
  id: `seed-${p.slug}`,
  active: true,
  image_url: null,
  sort: i,
  variants: p.variants.map((v, j) => ({
    id: `seed-${p.slug}-${j}`,
    name: v.name,
    price: v.price,
    stock: SEED_STOCK,
    sort: j,
  })),
}));
