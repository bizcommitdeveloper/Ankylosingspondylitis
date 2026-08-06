"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendChart } from "@/components/TrendChart";
import { useEntries } from "@/components/useEntries";
import { useAuth } from "@/components/AuthProvider";
import type { Entry, InstrumentType } from "@/lib/types";
import { severity } from "@/lib/scoring";
import { INSTRUMENT_INFO } from "@/lib/content";

function latestOf(entries: Entry[], type: InstrumentType): Entry | undefined {
  return [...entries].reverse().find((entry) => entry.type === type);
}

function ScoreCard({ type, entry }: { type: InstrumentType; entry?: Entry }) {
  const info = INSTRUMENT_INFO[type];
  const band = entry ? severity(type, entry.score) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{info.tagline}</p>
      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">Latest {info.name}</p>
      {entry ? (
        <>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {entry.score.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-slate-400">/ 10</span>
          </p>
          {band ? (
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${band.badgeClassName}`}>
              {band.label}
            </span>
          ) : null}
          <p className="mt-1 text-xs text-slate-400">{entry.referenceDate}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-400">No entries yet</p>
      )}
      <Link
        href={`/${type}`}
        className="mt-4 inline-block rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        New {info.name}
      </Link>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { entries, loading } = useEntries();
  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const hasEntries = entries.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {firstName}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Log how you&apos;re doing today, and watch the trend build over time.{" "}
        <Link href="/learn" className="font-medium text-brand-700 hover:underline dark:text-brand-300">
          New to these scores?
        </Link>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ScoreCard type="basdai" entry={latestOf(entries, "basdai")} />
        <ScoreCard type="basfi" entry={latestOf(entries, "basfi")} />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your trend</h2>
          {hasEntries ? (
            <Link href="/history" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
              View history →
            </Link>
          ) : null}
        </div>
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
        ) : hasEntries ? (
          <TrendChart entries={entries} />
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-600">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Your chart starts with entry one.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Fill in a BASDAI and a BASFI now to set your baseline, then come back regularly to watch the line take
              shape.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Link href="/basdai" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                Start BASDAI
              </Link>
              <Link
                href="/basfi"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Start BASFI
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  // Signed-out visitors get the onboarding page; the dashboard is for members.
  useEffect(() => {
    if (!loading && !user) {
      router.replace(configured ? "/welcome" : "/login");
    }
  }, [loading, user, configured, router]);

  if (loading || !user) {
    return <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  return <Dashboard />;
}
