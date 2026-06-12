import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";

export async function login(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to authentication state changes.
 */
export function subscribeToAuth(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
