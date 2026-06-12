import { motion } from "framer-motion";
import type { Category } from "../../types";

interface CategoryFiltersProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilters({ categories, activeId, onSelect }: CategoryFiltersProps) {
  return (
    <div className="no-scrollbar flex w-full gap-2 overflow-x-auto px-4 pb-1 pt-1 sm:gap-2.5 sm:px-6 lg:justify-center lg:px-0">
      <FilterPill
        label="الكل"
        active={activeId === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((category) => (
        <FilterPill
          key={category.id}
          label={category.name}
          active={activeId === category.id}
          onClick={() => onSelect(category.id)}
        />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out sm:px-5 sm:py-2.5 ${
        active ? "text-cream-50" : "text-espresso-500 hover:text-espresso-900"
      } active:scale-[0.97]`}
      style={{ transition: "color 200ms ease, transform 160ms ease-out" }}
    >
      {active && (
        <motion.span
          layoutId="active-category-pill"
          className="absolute inset-0 rounded-full bg-espresso-900 shadow-[var(--shadow-soft)]"
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        />
      )}
      <span className="relative z-10 whitespace-nowrap">{label}</span>
    </button>
  );
}
