import { useState } from "react";
import { motion } from "framer-motion";
import type { Category } from "../../types";
import { CategoryFormModal } from "./CategoryFormModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { addCategory, updateCategory, deleteCategory } from "../../lib/firebase";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const handleSave = async (data: { name: string }) => {
    if (editing) {
      await updateCategory(editing.id, data);
    } else {
      await addCategory({ name: data.name, order: categories.length });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteCategory(deleting.id);
    setDeleting(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-espresso-900 sm:text-xl">
            الفئات
          </h2>
          <p className="text-sm text-espresso-300">{categories.length} إجمالي</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-espresso-900 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          إضافة
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState message="لا توجد فئات بعد. أضف أول فئة للبدء." />
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[var(--shadow-soft)] ring-1 ring-espresso-900/[0.03]"
            >
              <span className="font-medium text-espresso-900">{category.name}</span>
              <div className="flex items-center gap-1.5">
                <IconButton
                  label="تعديل"
                  onClick={() => {
                    setEditing(category);
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
                <IconButton label="حذف" danger onClick={() => setDeleting(category)}>
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

      <CategoryFormModal
        open={modalOpen}
        category={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deleting !== null}
        title="حذف الفئة؟"
        description={`سيتم حذف "${deleting?.name}" نهائيًا. المنتجات في هذه الفئة ستبقى لكنها ستفقد فئتها.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export function IconButton({
  children,
  label,
  danger = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ease-out active:scale-[0.94] ${
        danger
          ? "text-espresso-300 hover:bg-red-50 hover:text-red-500"
          : "text-espresso-300 hover:bg-espresso-50 hover:text-espresso-900"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        {children}
      </svg>
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/60 px-6 py-12 text-center ring-1 ring-espresso-900/[0.03]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-espresso-50">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-espresso-300">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <p className="max-w-xs text-sm text-espresso-300">{message}</p>
    </div>
  );
}
