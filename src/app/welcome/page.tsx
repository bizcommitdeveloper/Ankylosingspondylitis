"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  ActivityIcon,
  GaugeIcon,
  HeartPulseIcon,
  ShieldIcon,
  SunriseIcon,
  TrendIcon,
} from "@/components/icons";
import { AS_OVERVIEW, INSTRUMENT_INFO, NOT_ADVICE, SOURCES, TRACKING_BENEFITS } from "@/lib/content";

const overviewIcons = [SunriseIcon, ActivityIcon, HeartPulseIcon, TrendIcon];

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Signed-in users don't need the marketing page.
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60rem_30rem_at_70%_-10%,white,transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
            Built for people living with Ankylosing Spondylitis
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Track your AS. See the trend. Own your care.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-50/90">
            Record the two standard measures — <strong>BASDAI</strong> and <strong>BASFI</strong> — in under
            two minutes. They&apos;re scored automatically and charted over time, so you and your clinician can
            see how you&apos;re really doing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get started — it&apos;s free
            </Link>
            <a
              href="#learn"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn how it works
            </a>
          </div>
          <p className="mt-6 text-xs text-brand-50/70">Private by design — your entries are visible only to you.</p>
        </div>
      </section>

      {/* What is AS */}
      <section id="learn" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{AS_OVERVIEW.title}</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{AS_OVERVIEW.summary}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {AS_OVERVIEW.highlights.map((item, i) => {
            const IconComponent = overviewIcons[i % overviewIcons.length];
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                    <IconComponent width={20} height={20} />
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The two instruments */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Two trusted measures, one simple app</h2>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            These are the same patient-reported scores used in AS clinics and research worldwide. Here they take
            about a minute each, on friendly 0–10 sliders.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {(["basdai", "basfi"] as const).map((type) => {
              const info = INSTRUMENT_INFO[type];
              const IconComponent = type === "basdai" ? GaugeIcon : ActivityIcon;
              return (
                <div
                  key={type}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                      <IconComponent width={22} height={22} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{info.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{info.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{info.measures}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 font-medium text-slate-500 dark:text-slate-400">Format</dt>
                      <dd className="text-slate-700 dark:text-slate-200">{info.scale}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 font-medium text-slate-500 dark:text-slate-400">Score</dt>
                      <dd className="text-slate-700 dark:text-slate-200">{info.formula}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Full name: {INSTRUMENT_INFO.basdai.full} &amp; {INSTRUMENT_INFO.basfi.full}.
          </p>
        </div>
      </section>

      {/* Why track */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why tracking helps</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TRACKING_BENEFITS.map((item, i) => {
            const IconComponent = [TrendIcon, HeartPulseIcon, ActivityIcon, ShieldIcon][i % 4];
            return (
              <div key={item.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                  <IconComponent width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold">Start tracking in two minutes</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-50/90">
            Create a free account, record your first BASDAI and BASFI, and watch your trend build from day one.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-sm transition-transform hover:scale-[1.02]"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Disclaimer + sources */}
      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">{NOT_ADVICE}</p>
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Sources</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
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
        </div>
      </footer>
    </div>
  );
}
