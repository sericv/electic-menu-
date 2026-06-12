import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "./Modal";
import type { Category, Product } from "../../types";
import { processImageToBase64 } from "../../lib/imageProcessing";

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "order">) => Promise<void>;
}

interface SizeRow {
  key: string;
  name: string;
  price: string;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  featured: boolean;
  sizes: SizeRow[];
}

let sizeKeyCounter = 0;
function newSizeKey() {
  sizeKeyCounter += 1;
  return `size-${Date.now()}-${sizeKeyCounter}`;
}

export function ProductFormModal({
  open,
  product,
  categories,
  onClose,
  onSave,
}: ProductFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={product ? "تعديل المنتج" : "إضافة منتج"}>
      {open && (
        <ProductForm
          key={product?.id ?? "new"}
          product={product}
          categories={categories}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "order">) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          categoryId: product.categoryId,
          imageUrl: product.imageUrl,
          featured: product.featured,
          sizes: (product.sizes ?? []).map((s) => ({
            key: newSizeKey(),
            name: s.name,
            price: String(s.price),
          })),
        }
      : {
          name: "",
          description: "",
          price: "",
          categoryId: categories[0]?.id ?? "",
          imageUrl: "",
          featured: false,
          sizes: [],
        }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSizes = form.sizes.length > 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await processImageToBase64(file);
      setForm((f) => ({ ...f, imageUrl: dataUrl }));
    } finally {
      setUploading(false);
    }
  };

  const addSize = () => {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { key: newSizeKey(), name: "", price: "" }] }));
  };

  const removeSize = (key: string) => {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((s) => s.key !== key) }));
  };

  const updateSize = (key: string, patch: Partial<Pick<SizeRow, "name" | "price">>) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.categoryId || !form.imageUrl) return;

    let sizes: { name: string; price: number }[] | undefined;
    let price: number;

    if (hasSizes) {
      const cleanedSizes = form.sizes
        .map((s) => ({ name: s.name.trim(), price: Number(s.price) }))
        .filter((s) => s.name && !Number.isNaN(s.price));

      if (cleanedSizes.length === 0) return;

      sizes = cleanedSizes;
      price = cleanedSizes[0].price;
    } else {
      price = Number(form.price);
      if (form.price === "" || Number.isNaN(price)) return;
    }

    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        ...(sizes ? { sizes } : {}),
        categoryId: form.categoryId,
        imageUrl: form.imageUrl,
        featured: form.featured,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const sizesValid =
    !hasSizes ||
    form.sizes.some((s) => s.name.trim() && s.price !== "" && !Number.isNaN(Number(s.price)));

  const isValid =
    form.name.trim() &&
    form.categoryId &&
    form.imageUrl &&
    sizesValid &&
    (hasSizes || (form.price !== "" && !Number.isNaN(Number(form.price))));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700">صورة المنتج</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-espresso-900/15 bg-white transition-colors duration-150 hover:border-amber-400"
        >
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-espresso-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium">اضغط لرفع صورة</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-espresso-200 border-t-espresso-700" />
            </div>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700" htmlFor="product-name">
          الاسم
        </label>
        <input
          id="product-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="مثال: كابتشينو"
          className="rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700" htmlFor="product-description">
          الوصف
        </label>
        <textarea
          id="product-description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="وصف قصير وشهي للمنتج"
          rows={2}
          className="resize-none rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-espresso-700" htmlFor="product-price">
            السعر (ر.س)
          </label>
          <input
            id="product-price"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="0.00"
            disabled={hasSizes}
            className="rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 disabled:cursor-not-allowed disabled:bg-espresso-50 disabled:text-espresso-300"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-espresso-700" htmlFor="product-category">
            الفئة
          </label>
          <select
            id="product-category"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
          >
            {categories.length === 0 && <option value="">لا توجد فئات</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sizes & prices */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-espresso-700">الأحجام والأسعار</label>
          <button
            type="button"
            onClick={addSize}
            className="flex items-center gap-1.5 rounded-full bg-espresso-50 px-3 py-1.5 text-xs font-semibold text-espresso-700 transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            إضافة حجم
          </button>
        </div>

        {hasSizes ? (
          <p className="text-xs text-espresso-300">
            عند إضافة أحجام، يتم استخدام أسعار الأحجام بدلاً من السعر العادي.
          </p>
        ) : (
          <p className="text-xs text-espresso-300">
            اترك هذا القسم فارغًا لاستخدام السعر العادي فقط.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {form.sizes.map((size) => (
              <motion.div
                key={size.key}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                className="flex items-center gap-2 rounded-2xl border border-espresso-900/[0.08] bg-white p-2"
              >
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) => updateSize(size.key, { name: e.target.value })}
                  placeholder="اسم الحجم (مثال: صغير)"
                  className="min-w-0 flex-1 rounded-xl border border-transparent bg-cream-50 px-3 py-2.5 text-sm text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={size.price}
                  onChange={(e) => updateSize(size.key, { price: e.target.value })}
                  placeholder="السعر"
                  className="w-24 shrink-0 rounded-xl border border-transparent bg-cream-50 px-3 py-2.5 text-sm text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
                />
                <button
                  type="button"
                  onClick={() => removeSize(size.key)}
                  aria-label="حذف الحجم"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-espresso-300 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-500 active:scale-[0.94]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Featured toggle */}
      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-espresso-900">منتج مميز</span>
          <span className="text-xs text-espresso-300">يظهر بحجم أكبر في القائمة</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.featured}
          onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-out ${
            form.featured ? "bg-amber-500" : "bg-espresso-100"
          }`}
        >
          <span
            className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
              form.featured ? "translate-x-[1.375rem]" : "translate-x-0"
            }`}
          />
        </button>
      </label>

      <button
        type="submit"
        disabled={saving || uploading || !isValid}
        className="rounded-full bg-espresso-900 px-5 py-3.5 text-sm font-semibold text-cream-50 transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "جاري الحفظ…" : product ? "حفظ التغييرات" : "إضافة منتج"}
      </button>
    </form>
  );
}
