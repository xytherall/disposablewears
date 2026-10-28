import type { CartItem } from "./CartProvider";
import { ProductImage } from "./ProductArt";

export function CartLineImage({ item, className = "" }: { item: CartItem; className?: string }) {
  return (
    <ProductImage
      product={{ name: item.productName, slug: item.slug, art: item.art, image_url: item.imageUrl }}
      variant={item.variantName}
      className={`float-item ${className}`}
      bare
    />
  );
}
