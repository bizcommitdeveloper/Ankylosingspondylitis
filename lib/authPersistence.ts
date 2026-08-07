import { getReactNativePersistence, initializeAuth, type Auth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

// `getReactNativePersistence` ships in the SDK's React Native build (resolved by
// Metro on native) but the published `firebase/auth` types omit it. Declare it
// so TypeScript matches the runtime API. This file is native-only — Metro loads
// `authPersistence.web.ts` for web, so the RN helper never enters the web bundle.
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: unknown): import("firebase/auth").Persistence;
}

/** Native: persist the session with AsyncStorage so it survives app restarts. */
export function createAuth(app: FirebaseApp): Auth {
  return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}
