import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface ProductFeedProps {
  products: Product[];
  activeCategoryId: string | null;
}

export function ProductFeed({ products, activeCategoryId }: ProductFeedProps) {
  const scrollRef = useAutoScroll<HTMLDivElement>({
    speed: 0.35,
    resumeDelay: 4000,
    disabled: activeCategoryId !== null,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-espresso-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-espresso-300">
            <path
              d="M4 9h13v5a5.5 5.5 0 0 1-5.5 5.5h-2A5.5 5.5 0 0 1 4 14V9Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <p className="font-display text-lg text-espresso-500">لا توجد عناصر في هذه الفئة بعد</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-5 sm:px-6"
    >
      <div className="mx-auto max-w-3xl columns-2 gap-3 sm:gap-4 lg:max-w-5xl lg:columns-3 lg:gap-5">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div key={product.id} layout className="mb-3 break-inside-avoid sm:mb-4 lg:mb-5">
              <ProductCard product={product} featured={product.featured} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
