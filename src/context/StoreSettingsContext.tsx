import { useEffect, useState, type ReactNode } from "react";
import type { StoreSettings } from "../types";
import { subscribeToStoreSettings, defaultStoreSettings } from "../lib/firebase";
import { StoreSettingsContext } from "./storeSettingsContextDefinition";

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStoreSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
