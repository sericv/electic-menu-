import { useMemo, useState } from "react";
import { MenuHeader } from "../components/menu/MenuHeader";
import { ProductFeed } from "../components/menu/ProductFeed";
import { useMenuData } from "../hooks/useMenuData";

export function CustomerMenu() {
  const { categories, products, loading } = useMenuData();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const visibleProducts = useMemo(() => {
    if (activeCategoryId === null) return products;
    return products.filter((p) => p.categoryId === activeCategoryId);
  }, [products, activeCategoryId]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso-200 border-t-espresso-700" />
          <p className="text-sm text-espresso-300">جاري تحضير القائمة…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-cream-100">
      <MenuHeader
        categories={categories}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />
      <ProductFeed products={visibleProducts} activeCategoryId={activeCategoryId} />
    </div>
  );
}
