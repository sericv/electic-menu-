import { useRef, useState } from "react";
import type { StoreSettings } from "../../types";
import { updateStoreSettings } from "../../lib/firebase";
import { processImageToBase64 } from "../../lib/imageProcessing";

interface StoreSettingsManagerProps {
  settings: StoreSettings;
}

export function StoreSettingsManager({ settings }: StoreSettingsManagerProps) {
  const [name, setName] = useState(settings.name);
  const [description, setDescription] = useState(settings.description);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await processImageToBase64(file);
      setLogoUrl(dataUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateStoreSettings({ name: name.trim(), description: description.trim(), logoUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-espresso-900 sm:text-xl">
          إعدادات المتجر
        </h2>
        <p className="text-sm text-espresso-300">معلومات المتجر التي تظهر في القائمة</p>
      </div>

      {/* Logo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700">شعار المتجر</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-espresso-900/15 bg-white transition-colors duration-150 hover:border-amber-400"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-espresso-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium">رفع شعار</span>
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
        <label className="text-sm font-semibold text-espresso-700" htmlFor="store-name">
          اسم المتجر
        </label>
        <input
          id="store-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: مقهى الزاوية"
          className="rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso-700" htmlFor="store-description">
          وصف المتجر
        </label>
        <textarea
          id="store-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف قصير يظهر أسفل اسم المتجر"
          rows={2}
          className="resize-none rounded-2xl border border-espresso-900/[0.08] bg-white px-4 py-3 text-base text-espresso-900 outline-none transition-shadow duration-150 ease-out placeholder:text-espresso-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-full bg-espresso-900 px-5 py-3.5 text-sm font-semibold text-cream-50 transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "جاري الحفظ…" : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </button>
    </form>
  );
}
