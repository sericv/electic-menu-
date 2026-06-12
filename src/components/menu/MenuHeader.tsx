import { motion } from "framer-motion";
import type { Category } from "../../types";
import { CategoryFilters } from "./CategoryFilters";
import { useStoreSettings } from "../../hooks/useStoreSettings";

interface MenuHeaderProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function MenuHeader({ categories, activeId, onSelect }: MenuHeaderProps) {
  const { settings } = useStoreSettings();

  return (
    <header className="sticky top-0 z-20 border-b border-espresso-900/[0.04] bg-cream-50/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:gap-5 sm:px-6 sm:pt-5 lg:max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-3"
        >
          <Logo logoUrl={settings.logoUrl} />
          <div className="flex flex-col">
            <h1 className="font-display text-xl font-semibold leading-tight tracking-tight text-espresso-900 sm:text-2xl">
              {settings.name || "القائمة الرقمية"}
            </h1>
            {settings.description && (
              <p className="text-xs font-medium text-espresso-300 sm:text-sm">
                {settings.description}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="-mx-4 sm:mx-0"
        >
          <CategoryFilters categories={categories} activeId={activeId} onSelect={onSelect} />
        </motion.div>
      </div>
    </header>
  );
}

function Logo({ logoUrl }: { logoUrl: string }) {
  if (logoUrl) {
    return (
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-espresso-900 shadow-[var(--shadow-soft)] sm:h-12 sm:w-12">
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-espresso-900 shadow-[var(--shadow-soft)] sm:h-12 sm:w-12">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cream-100">
        <path
          d="M4 9h13v5a5.5 5.5 0 0 1-5.5 5.5h-2A5.5 5.5 0 0 1 4 14V9Z"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <path
          d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H17"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M8.5 3.5c0 .9-1 .9-1 1.8s1 .9 1 1.8M12 3.5c0 .9-1 .9-1 1.8s1 .9 1 1.8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
