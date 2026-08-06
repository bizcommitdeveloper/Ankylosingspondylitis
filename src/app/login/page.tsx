"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { user, loading, configured, signInWithGoogle, signInWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await registerWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(readableAuthError(err));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(readableAuthError(err));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
          AS
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ankylosing Spondylitis</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Sign in to track your BASDAI and BASFI scores over time.
        </p>
        <Link href="/welcome" className="mt-2 inline-block text-xs font-medium text-brand-700 hover:underline dark:text-brand-300">
          New here? See how it works →
        </Link>
      </div>

      {!configured ? (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Firebase isn&apos;t configured yet. Set the <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables
          (see <code>.env.example</code>) to enable sign-in.
        </div>
      ) : (
        <>
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Continue with Google
          </button>

          <div className="my-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {mode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "register" ? "signin" : "register");
              setError(null);
            }}
            className="mt-4 text-center text-sm text-brand-700 hover:underline dark:text-brand-300"
          >
            {mode === "register"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </>
      )}

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function readableAuthError(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: unknown }).code) : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Try signing in.";
    case "auth/weak-password":
      return "Please choose a password of at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed before completing.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
}
