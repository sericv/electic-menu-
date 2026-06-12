import { motion } from "framer-motion";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, duration: 0.6, bounce: 0.15 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] as const },
  },
};

const sizeRowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.05 * i, ease: [0.23, 1, 0.32, 1] as const },
  }),
};

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const sizes = product.sizes ?? [];
  const hasMultipleSizes = sizes.length > 1;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -4 }}
      transition={{ layout: { type: "spring", duration: 0.5, bounce: 0.2 } }}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-white/80 ring-1 ring-espresso-900/5 backdrop-blur-sm ${
        featured
          ? "shadow-[var(--shadow-lift)]"
          : "shadow-[var(--shadow-card)]"
      }`}
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden ${
          featured ? "aspect-[4/3]" : "aspect-[5/4]"
        }`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-900/15 via-transparent to-transparent" />

        {featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-espresso-700 shadow-[var(--shadow-soft)] backdrop-blur-md">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              className="text-amber-500"
            >
              <path
                d="M12 2.5l2.6 5.6 6.1.8-4.4 4.3 1 6.1L12 16.4l-5.3 2.9 1-6.1L3.3 8.9l6.1-.8L12 2.5z"
                fill="currentColor"
              />
            </svg>
            مميز
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1.5 ${featured ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-display font-medium leading-tight text-espresso-900 ${
              featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            {product.name}
          </h3>
          {!hasMultipleSizes && (
            <span
              className={`shrink-0 font-display font-semibold text-amber-600 ${
                featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
              }`}
            >
              {(sizes[0]?.price ?? product.price).toFixed(2)} ر.س
            </span>
          )}
        </div>
        <p
          className={`text-espresso-500 ${
            featured ? "text-sm sm:text-base" : "text-xs sm:text-sm"
          } leading-relaxed`}
        >
          {product.description}
        </p>

        {hasMultipleSizes && (
          <div className="mt-2 flex flex-col gap-1.5">
            <span
              className={`font-semibold text-espresso-300 ${
                featured ? "text-[11px] sm:text-xs" : "text-[10px] sm:text-[11px]"
              }`}
            >
              الأحجام المتوفرة
            </span>
            <div
              className={`flex flex-col divide-y divide-espresso-900/[0.06] overflow-hidden rounded-2xl bg-espresso-900/[0.025] ${
                featured ? "text-sm sm:text-base" : "text-xs sm:text-sm"
              }`}
            >
              {sizes.map((size, i) => (
                <motion.div
                  key={size.name}
                  custom={i}
                  variants={sizeRowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex items-center justify-between gap-3 ${
                    featured ? "px-4 py-2.5" : "px-3.5 py-2"
                  }`}
                >
                  <span className="font-medium text-espresso-700">{size.name}</span>
                  <span className="font-display font-semibold text-amber-600">
                    {size.price.toFixed(2)} ر.س
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
