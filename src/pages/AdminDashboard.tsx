import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMenuData } from "../hooks/useMenuData";
import { useAuth } from "../hooks/useAuth";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { AdminLogin } from "../components/admin/AdminLogin";
import { CategoryManager } from "../components/admin/CategoryManager";
import { ProductManager } from "../components/admin/ProductManager";
import { ProductReorder } from "../components/admin/ProductReorder";
import { StoreSettingsManager } from "../components/admin/StoreSettingsManager";
import { logout } from "../lib/firebase";

type Tab = "settings" | "categories" | "products" | "reorder";

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const { categories, products } = useMenuData();
  const { settings } = useStoreSettings();
  const [tab, setTab] = useState<Tab>("settings");

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-cream-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso-200 border-t-espresso-700" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-dvh bg-cream-100">
      <header className="sticky top-0 z-20 border-b border-espresso-900/[0.04] bg-cream-50/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-lg font-semibold text-espresso-900 sm:text-xl">
              لوحة التحكم
            </h1>
            <p className="text-xs text-espresso-300">{settings.name || "القائمة الرقمية"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-full bg-espresso-50 px-4 py-2 text-sm font-semibold text-espresso-700 transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              عرض القائمة
            </Link>
            <button
              onClick={() => logout()}
              className="rounded-full bg-espresso-50 px-4 py-2 text-sm font-semibold text-espresso-700 transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-6">
          <TabButton label="إعدادات المتجر" active={tab === "settings"} onClick={() => setTab("settings")} />
          <TabButton label="الفئات" active={tab === "categories"} onClick={() => setTab("categories")} />
          <TabButton label="المنتجات" active={tab === "products"} onClick={() => setTab("products")} />
          <TabButton label="إعادة ترتيب المنتجات" active={tab === "reorder"} onClick={() => setTab("reorder")} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {tab === "settings" ? (
          <StoreSettingsManager settings={settings} />
        ) : tab === "categories" ? (
          <CategoryManager categories={categories} />
        ) : tab === "products" ? (
          <ProductManager products={products} categories={categories} />
        ) : (
          <ProductReorder products={products} categories={categories} />
        )}
      </main>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out"
    >
      {active && (
        <motion.span
          layoutId="active-admin-tab"
          className="absolute inset-0 rounded-full bg-espresso-900"
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        />
      )}
      <span className={`relative z-10 ${active ? "text-cream-50" : "text-espresso-500"}`}>{label}</span>
    </button>
  );
}
