"use client";

import Link from "next/link";
import { AS_OVERVIEW, INSTRUMENT_INFO, NOT_ADVICE, SOURCES } from "@/lib/content";
import { getInstrument } from "@/lib/questions";
import type { InstrumentType } from "@/lib/types";

function InstrumentSection({ type }: { type: InstrumentType }) {
  const info = INSTRUMENT_INFO[type];
  const instrument = getInstrument(type);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {info.name} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">— {info.full}</span>
      </h2>

      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">What it measures</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">{info.measures}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">How it&apos;s scored</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">
            {info.scale} {info.formula}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">Reading the result</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300">{info.interpretation}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800 dark:text-slate-100">The questions</dt>
          <dd className="mt-1">
            <ol className="list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-300">
              {instrument.questions.map((q, i) => (
                <li key={i}>{q.text}</li>
              ))}
            </ol>
          </dd>
        </div>
      </dl>

      <Link
        href={`/${type}`}
        className="mt-5 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Fill in {info.name}
      </Link>
    </section>
  );
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learn</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          A quick, plain-language guide to Ankylosing Spondylitis and the two scores this app tracks.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{AS_OVERVIEW.title}</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{AS_OVERVIEW.summary}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {AS_OVERVIEW.highlights.map((item) => (
            <div key={item.title}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <strong>When to see a doctor.</strong> {AS_OVERVIEW.seeDoctor}
        </p>
      </section>

      <div className="mt-6 space-y-6">
        <InstrumentSection type="basdai" />
        <InstrumentSection type="basfi" />
      </div>

      <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">{NOT_ADVICE}</p>
        <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Sources</p>
        <ul className="mt-1 space-y-1 text-xs">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline dark:text-brand-300"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
