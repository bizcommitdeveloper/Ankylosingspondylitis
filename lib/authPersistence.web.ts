import { getAuth, type Auth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";

/**
 * Web: `getAuth` uses the browser's default persistence (IndexedDB / local
 * storage), so the session survives page reloads. Metro resolves this file for
 * the web platform in place of `authPersistence.ts`.
 */
export function createAuth(app: FirebaseApp): Auth {
  return getAuth(app);
}
