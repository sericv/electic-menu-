import { useContext } from "react";
import { MenuDataContext, type MenuDataContextValue } from "../context/menuDataContextDefinition";

export function useMenuData(): MenuDataContextValue {
  const ctx = useContext(MenuDataContext);
  if (!ctx) {
    throw new Error("useMenuData must be used within a MenuDataProvider");
  }
  return ctx;
}
