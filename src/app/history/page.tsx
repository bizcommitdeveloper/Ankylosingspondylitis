"use client";

import { AuthGate } from "@/components/AuthGate";
import { TrendChart } from "@/components/TrendChart";
import { useEntries } from "@/components/useEntries";
import { getInstrument } from "@/lib/questions";
import { severity } from "@/lib/scoring";
import type { Entry } from "@/lib/types";

function EntryRow({ entry }: { entry: Entry }) {
  const instrument = getInstrument(entry.type);
  const band = severity(entry.type, entry.score);
  return (
    <tr className="border-b border-slate-100 last:border-0 dark:border-slate-700">
      <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-300">{entry.referenceDate}</td>
      <td className="py-3 pr-4 text-sm font-medium text-slate-900 dark:text-white">{instrument.title}</td>
      <td className="py-3 pr-4 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
        {entry.score.toFixed(1)}
      </td>
      <td className={`py-3 pr-4 text-xs font-medium ${band.className}`}>{band.label}</td>
      <td className="max-w-[16rem] truncate py-3 text-sm text-slate-500 dark:text-slate-400" title={entry.note}>
        {entry.note || "—"}
      </td>
    </tr>
  );
}

function History() {
  const { entries, loading, error } = useEntries();
  const newestFirst = [...entries].reverse();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Every saved BASDAI and BASFI entry, and how your scores have moved.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Trend</h2>
        {loading ? <p className="py-10 text-center text-sm text-slate-500">Loading…</p> : <TrendChart entries={entries} />}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">All entries</h2>
        {error ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>
        ) : loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
        ) : newestFirst.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No entries yet. Complete a BASDAI or BASFI form to see it here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-600 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Form</th>
                  <th className="py-2 pr-4 font-medium">Score</th>
                  <th className="py-2 pr-4 font-medium">Band</th>
                  <th className="py-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {newestFirst.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGate>
      <History />
    </AuthGate>
  );
}
