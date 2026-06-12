import { createContext } from "react";
import type { StoreSettings } from "../types";

export interface StoreSettingsContextValue {
  settings: StoreSettings;
  loading: boolean;
}

export const StoreSettingsContext = createContext<StoreSettingsContextValue | undefined>(undefined);
