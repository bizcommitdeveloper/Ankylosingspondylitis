"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Wraps pages that require a signed-in user. Redirects to /login when there is
 * no session, and shows a lightweight loading state while auth resolves.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/login");
    }
  }, [loading, configured, user, router]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Firebase not configured</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Set the <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">NEXT_PUBLIC_FIREBASE_*</code> environment
          variables (see <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env.example</code>) to enable
          sign-in and data storage.
        </p>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
