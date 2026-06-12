import { useEffect, useState, type ReactNode } from "react";
import type { Category, Product } from "../types";
import { subscribeToCategories, subscribeToProducts } from "../lib/firebase";
import { MenuDataContext } from "./menuDataContextDefinition";

export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const unsubCategories = subscribeToCategories((data) => {
      setCategories([...data].sort((a, b) => a.order - b.order));
      setCategoriesLoaded(true);
    });
    const unsubProducts = subscribeToProducts((data) => {
      setProducts([...data].sort((a, b) => a.order - b.order));
      setProductsLoaded(true);
    });

    return () => {
      unsubCategories();
      unsubProducts();
    };
  }, []);

  return (
    <MenuDataContext.Provider
      value={{
        categories,
        products,
        loading: !categoriesLoaded || !productsLoaded,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  );
}
