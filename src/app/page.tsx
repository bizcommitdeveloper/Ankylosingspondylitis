"use client";

import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { TrendChart } from "@/components/TrendChart";
import { useEntries } from "@/components/useEntries";
import { useAuth } from "@/components/AuthProvider";
import type { Entry, InstrumentType } from "@/lib/types";
import { severity } from "@/lib/scoring";

function latestOf(entries: Entry[], type: InstrumentType): Entry | undefined {
  return [...entries].reverse().find((entry) => entry.type === type);
}

function ScoreCard({ type, entry }: { type: InstrumentType; entry?: Entry }) {
  const title = type === "basdai" ? "BASDAI" : "BASFI";
  const caption = type === "basdai" ? "Disease activity" : "Physical function";
  const band = entry ? severity(type, entry.score) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{caption}</p>
      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">Latest {title}</p>
      {entry ? (
        <>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {entry.score.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-slate-400">/ 10</span>
          </p>
          {band ? <p className={`text-xs font-medium ${band.className}`}>{band.label}</p> : null}
          <p className="mt-1 text-xs text-slate-400">{entry.referenceDate}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-400">No entries yet</p>
      )}
      <Link
        href={`/${type}`}
        className="mt-4 inline-block rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        New {title}
      </Link>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { entries, loading } = useEntries();
  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {firstName}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Log how you&apos;re doing today, and watch the trend over time.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ScoreCard type="basdai" entry={latestOf(entries, "basdai")} />
        <ScoreCard type="basfi" entry={latestOf(entries, "basfi")} />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your trend</h2>
          <Link href="/history" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
            View history →
          </Link>
        </div>
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
        ) : (
          <TrendChart entries={entries} />
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}
