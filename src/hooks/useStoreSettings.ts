import { useContext } from "react";
import { StoreSettingsContext, type StoreSettingsContextValue } from "../context/storeSettingsContextDefinition";

export function useStoreSettings(): StoreSettingsContextValue {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    throw new Error("useStoreSettings must be used within a StoreSettingsProvider");
  }
  return ctx;
}
