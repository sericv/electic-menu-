import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "../../types";

const COLLECTION = "products";

type ProductInput = Omit<Product, "id">;

/**
 * Subscribe to live product updates, ordered by `order`.
 */
export function subscribeToProducts(
  callback: (products: Product[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Product)
    );
    callback(products);
  });
}

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(product: ProductInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), product);
  return ref.id;
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>
): Promise<void> {
  const payload: Record<string, unknown> = { ...updates };
  if (!("sizes" in updates) || updates.sizes === undefined) {
    payload.sizes = deleteField();
  }
  await updateDoc(doc(db, COLLECTION, id), payload);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Persists a new order for a set of products (e.g. after drag-and-drop
 * reordering within a category). Each entry's `order` is written in a
 * single batch.
 */
export async function reorderProducts(
  orderedIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, COLLECTION, id), { order: index });
  });
  await batch.commit();
}
