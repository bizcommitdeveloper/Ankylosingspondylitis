import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// `getReactNativePersistence` ships in the SDK's React Native build (resolved by
// Metro) but the published `firebase/auth` types entry omits it. Declare it so
// TypeScript matches the runtime API.
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: unknown): import("firebase/auth").Persistence;
}

/**
 * Firebase config comes from EXPO_PUBLIC_* env vars. These are embedded in the
 * app bundle; they are public project identifiers, not secrets — access is
 * controlled by Firestore security rules. Copy `.env.example` to `.env.local`.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let authInstance: Auth | undefined;

/**
 * Auth is initialised once with AsyncStorage persistence so the session
 * survives app restarts. `initializeAuth` throws if called twice, so we fall
 * back to `getAuth` on the second call.
 */
export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    try {
      authInstance = initializeAuth(getFirebaseApp(), {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      authInstance = getAuth(getFirebaseApp());
    }
  }
  return authInstance;
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
