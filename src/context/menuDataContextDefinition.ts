import { createContext } from "react";
import type { Category, Product } from "../types";

export interface MenuDataContextValue {
  categories: Category[];
  products: Product[];
  loading: boolean;
}

export const MenuDataContext = createContext<MenuDataContextValue | undefined>(undefined);
