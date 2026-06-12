import { useState } from "react";
import { Modal } from "./Modal";
import type { Category } from "../../types";

interface CategoryFormModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void>;
}

export function CategoryFormModal({ open, category, onClose, onSave }: CategoryFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={category ? "تعديل الفئة" : "إضافة فئة"}>
      {open && (
        <CategoryForm
          key={category?.id ?? "new"}
          category={category}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700" htmlFor="category-name">
          اسم الفئة
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: قهوة"
          autoFocus
          className="rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !name.trim()}
        className="rounded-full bg-espresso-900 px-5 py-3.5 text-sm font-semibold text-cream-50 transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "جاري الحفظ…" : category ? "حفظ التغييرات" : "إضافة فئة"}
      </button>
    </form>
  );
}
