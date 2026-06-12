import type { Product } from "../types";

/**
 * Formats a product's price for compact display (e.g. admin list rows).
 * Shows a price range when multiple sizes exist, otherwise the single price.
 */
export function formatProductPrice(product: Product): string {
  if (product.sizes && product.sizes.length > 0) {
    const prices = product.sizes.map((s) => s.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toFixed(2)} ر.س`;
    return `${min.toFixed(2)}–${max.toFixed(2)} ر.س`;
  }
  return `${product.price.toFixed(2)} ر.س`;
}
