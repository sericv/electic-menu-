import { useState } from "react";
import { motion } from "framer-motion";
import type { Category, Product } from "../../types";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { IconButton, EmptyState } from "./CategoryManager";
import { addProduct, updateProduct, deleteProduct } from "../../lib/firebase";
import { formatProductPrice } from "../../lib/formatPrice";

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
}

export function ProductManager({ products, categories }: ProductManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string | "all">("all");

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "بدون فئة";

  const visibleProducts =
    filterCategoryId === "all" ? products : products.filter((p) => p.categoryId === filterCategoryId);

  const handleSave = async (data: Omit<Product, "id" | "order">) => {
    if (editing) {
      await updateProduct(editing.id, data);
    } else {
      const inCategory = products.filter((p) => p.categoryId === data.categoryId).length;
      await addProduct({ ...data, order: inCategory });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteProduct(deleting.id);
    setDeleting(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-espresso-900 sm:text-xl">
            المنتجات
          </h2>
          <p className="text-sm text-espresso-300">{products.length} إجمالي</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          disabled={categories.length === 0}
          className="flex items-center gap-2 rounded-full bg-espresso-900 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-transform duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          إضافة
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState message="أضف فئة أولاً، ثم يمكنك البدء بإضافة المنتجات." />
      ) : (
        <>
          {/* Category filter pills */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <FilterChip
              label="الكل"
              active={filterCategoryId === "all"}
              onClick={() => setFilterCategoryId("all")}
            />
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                label={c.name}
                active={filterCategoryId === c.id}
                onClick={() => setFilterCategoryId(c.id)}
              />
            ))}
          </div>

          {visibleProducts.length === 0 ? (
            <EmptyState message="لا توجد منتجات في هذه الفئة بعد." />
          ) : (
            <div className="flex flex-col gap-2">
              {visibleProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[var(--shadow-soft)] ring-1 ring-espresso-900/[0.03]"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-espresso-900">{product.name}</span>
                      {product.featured && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-600">
                          مميز
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-espresso-300">
                      {categoryName(product.categoryId)} · {formatProductPrice(product)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 pr-1">
                    <IconButton
                      label="تعديل"
                      onClick={() => {
                        setEditing(product);
                        setModalOpen(true);
                      }}
                    >
                      <path
                        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </IconButton>
                    <IconButton label="حذف" danger onClick={() => setDeleting(product)}>
                      <path
                        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </IconButton>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <ProductFormModal
        open={modalOpen}
        product={editing}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deleting !== null}
        title="حذف المنتج؟"
        description={`سيتم حذف "${deleting?.name}" نهائيًا من القائمة.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ease-out ${
        active ? "bg-espresso-900 text-cream-50" : "bg-white text-espresso-500 ring-1 ring-espresso-900/[0.06]"
      }`}
    >
      {label}
    </button>
  );
}
