import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./config";
import type { StoreSettings } from "../../types";

const COLLECTION = "settings";
const DOC_ID = "store";

export const defaultStoreSettings: StoreSettings = {
  name: "",
  description: "",
  logoUrl: "",
};

/**
 * Subscribe to live store settings updates.
 */
export function subscribeToStoreSettings(
  callback: (settings: StoreSettings) => void
): () => void {
  return onSnapshot(doc(db, COLLECTION, DOC_ID), (snapshot) => {
    if (snapshot.exists()) {
      callback({ ...defaultStoreSettings, ...(snapshot.data() as Partial<StoreSettings>) });
    } else {
      callback(defaultStoreSettings);
    }
  });
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), updates, { merge: true });
}
