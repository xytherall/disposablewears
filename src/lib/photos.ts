// Product photos bundled with the site (public/products), one per colour.
// A photo uploaded in the admin panel still takes priority over these.
const PHOTOS: Record<string, string[]> = {
  "disposable-bed-sheet": ["blue", "black", "white"],
  "disposable-couch-cover": ["blue", "black", "white"],
  "isolation-gown": ["blue", "white"],
  "ot-gown-with-trouser": ["blue", "white"],
  "bouffant-cap": ["blue"],
  "shoe-cover": ["blue"],
  "face-mask": ["blue", "black"],
  "disposable-gloves": ["transparent"],
  "spa-gown": ["female"],
  "chef-apron": ["blue", "white"],
  "barber-apron": ["black", "white", "blue"],
};

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function bundledPhoto(slug: string | undefined, variant?: string): string | null {
  const options = slug ? PHOTOS[slug] : undefined;
  if (!options?.length) return null;
  const v = key(variant ?? "");
  const match = options.find((o) => o === v) ?? options.find((o) => v.split("-").includes(o)) ?? options[0];
  return `/products/${slug}--${match}.webp`;
}
