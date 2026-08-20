import { CartItem } from "../context/CartContext";
import { Product, FrameOption, SizeOption } from "../data/types";

export function computeUnitPrice(
  product: Product,
  frame: FrameOption,
  size: SizeOption
): number {
  return product.price + frame.priceModifier + size.priceModifier;
}

export function buildCartItem(
  product: Product,
  frame: FrameOption,
  size: SizeOption,
  quantity: number
): CartItem {
  return {
    key: `${product.id}-${frame.id}-${size.id}`,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    artist: product.artist,
    image: product.images[0],
    frameId: frame.id,
    frameName: frame.name,
    sizeId: size.id,
    sizeLabel: size.label,
    unitPrice: computeUnitPrice(product, frame, size),
    quantity,
  };
}
