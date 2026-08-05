"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { ScaleSlider } from "./ScaleSlider";
import type { Instrument } from "@/lib/questions";
import { computeScore, severity } from "@/lib/scoring";
import { saveEntry } from "@/lib/firestore";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function QuestionnaireForm({ instrument }: { instrument: Instrument }) {
  const { user } = useAuth();
  const router = useRouter();

  const [answers, setAnswers] = useState<number[]>(() =>
    instrument.questions.map((q) => q.min),
  );
  const [referenceDate, setReferenceDate] = useState<string>(todayIso());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = useMemo(() => computeScore(instrument.type, answers), [instrument.type, answers]);
  const band = severity(instrument.type, score);

  function setAnswer(index: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveEntry(user.uid, {
        type: instrument.type,
        answers,
        score,
        note: note.trim(),
        referenceDate,
      });
      router.push("/history");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this entry. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{instrument.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{instrument.subtitle}</p>
        <p className="mt-3 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:bg-brand-900/40 dark:text-brand-100">
          {instrument.instruction}
        </p>
      </header>

      <div className="mb-6">
        <label htmlFor="referenceDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Date this assessment refers to
        </label>
        <input
          id="referenceDate"
          type="date"
          value={referenceDate}
          max={todayIso()}
          onChange={(event) => setReferenceDate(event.target.value)}
          className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {instrument.questions.map((question, index) => (
          <ScaleSlider
            key={index}
            index={index}
            question={question}
            value={answers[index]}
            onChange={(value) => setAnswer(index, value)}
          />
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Anything worth remembering — a flare, a medication change, poor sleep…"
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {instrument.title} score
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {score.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-slate-400">/ 10</span>
          </p>
          <p className={`text-xs font-medium ${band.className}`}>{band.label}</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save entry"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        This tool records and visualises your own entries. It is not a diagnostic tool and does not
        provide medical advice.
      </p>
    </form>
  );
}
