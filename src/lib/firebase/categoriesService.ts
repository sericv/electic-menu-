import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import type { Category } from "../../types";

const COLLECTION = "categories";

type CategoryInput = Omit<Category, "id">;

/**
 * Subscribe to live category updates, ordered by `order`.
 */
export function subscribeToCategories(
  callback: (categories: Category[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Category)
    );
    callback(categories);
  });
}

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function addCategory(category: CategoryInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), category);
  return ref.id;
}

export async function updateCategory(
  id: string,
  updates: Partial<CategoryInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
