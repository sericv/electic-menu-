import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase configuration for the "coffee-loyalty" project.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCGoEMEOKiL0QwywTOEd59GOeteIZ9celE",
  authDomain: "coffee-loyalty-11dfc.firebaseapp.com",
  projectId: "coffee-loyalty-11dfc",
  storageBucket: "coffee-loyalty-11dfc.firebasestorage.app",
  messagingSenderId: "124581098932",
  appId: "1:124581098932:web:54218b0d11f7ec27e2eee1",
};

export const isFirebaseConfigured = true;

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };
