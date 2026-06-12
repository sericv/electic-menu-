import { useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Category, Product } from "../../types";
import { reorderProducts } from "../../lib/firebase";
import { formatProductPrice } from "../../lib/formatPrice";
import { EmptyState } from "./CategoryManager";

interface ProductReorderProps {
  products: Product[];
  categories: Category[];
}

export function ProductReorder({ products, categories }: ProductReorderProps) {
  if (categories.length === 0) {
    return <EmptyState message="أضف فئة أولاً، ثم يمكنك ترتيب المنتجات." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-espresso-300">
        اسحب المنتجات لإعادة ترتيبها داخل كل فئة. سيظهر الترتيب للعملاء فورًا.
      </p>
      {categories.map((category) => {
        const categoryProducts = products
          .filter((p) => p.categoryId === category.id)
          .sort((a, b) => a.order - b.order);

        if (categoryProducts.length === 0) return null;

        const ids = categoryProducts.map((p) => p.id).join(",");

        return (
          <CategoryGroup key={`${category.id}:${ids}`} title={category.name} products={categoryProducts} />
        );
      })}
    </div>
  );
}

function CategoryGroup({ title, products }: { title: string; products: Product[] }) {
  const [items, setItems] = useState(products);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    void reorderProducts(reordered.map((p) => p.id));
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-1 font-display text-base font-semibold text-espresso-900">{title}</h3>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((product, i) => (
              <SortableRow key={product.id} product={product} index={i} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRow({ product, index }: { product: Product; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02, ease: [0.23, 1, 0.32, 1] }}
      className={`flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[var(--shadow-soft)] ring-1 ring-espresso-900/[0.03] ${
        isDragging ? "z-10 shadow-[var(--shadow-lift)]" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="سحب لإعادة الترتيب"
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full text-espresso-300 transition-colors duration-150 ease-out hover:bg-espresso-50 hover:text-espresso-700 active:cursor-grabbing"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="6" r="1.4" fill="currentColor" />
          <circle cx="15" cy="6" r="1.4" fill="currentColor" />
          <circle cx="9" cy="12" r="1.4" fill="currentColor" />
          <circle cx="15" cy="12" r="1.4" fill="currentColor" />
          <circle cx="9" cy="18" r="1.4" fill="currentColor" />
          <circle cx="15" cy="18" r="1.4" fill="currentColor" />
        </svg>
      </button>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-12 w-12 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <span className="block truncate font-medium text-espresso-900">{product.name}</span>
        <span className="block truncate text-xs text-espresso-300">
          {formatProductPrice(product)}
        </span>
      </div>
      <span className="shrink-0 rounded-full bg-espresso-50 px-2.5 py-1 text-xs font-semibold text-espresso-500">
        {index + 1}
      </span>
    </motion.div>
  );
}
