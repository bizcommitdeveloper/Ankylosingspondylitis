import type { InstrumentType } from "./types";

/**
 * BASDAI — Bath Ankylosing Spondylitis Disease Activity Index.
 *
 * Six questions, each 0–10:
 *   Q1 fatigue, Q2 spinal pain, Q3 peripheral joint pain,
 *   Q4 enthesitis/tenderness, Q5 morning stiffness severity,
 *   Q6 morning stiffness duration.
 *
 * Score = ( Q1 + Q2 + Q3 + Q4 + (Q5 + Q6) / 2 ) / 5   → 0–10
 */
export function basdaiScore(answers: number[]): number {
  const [q1, q2, q3, q4, q5, q6] = answers;
  const stiffness = (q5 + q6) / 2;
  return (q1 + q2 + q3 + q4 + stiffness) / 5;
}

/**
 * BASFI — Bath Ankylosing Spondylitis Functional Index.
 *
 * Ten questions, each 0–10 (easy → impossible).
 * Score = mean of the ten answers → 0–10
 */
export function basfiScore(answers: number[]): number {
  if (answers.length === 0) return 0;
  const sum = answers.reduce((total, value) => total + value, 0);
  return sum / answers.length;
}

export function computeScore(type: InstrumentType, answers: number[]): number {
  const raw = type === "basdai" ? basdaiScore(answers) : basfiScore(answers);
  // Keep one decimal place, the convention for both indices.
  return Math.round(raw * 10) / 10;
}

export interface Severity {
  label: string;
  /** One short, hedged sentence of context. Informational only. */
  description: string;
  /** Tailwind text colour class. */
  className: string;
  /** Tailwind classes for a coloured pill/badge. */
  badgeClassName: string;
}

const TONE = {
  calm: {
    className: "text-brand-700 dark:text-brand-300",
    badgeClassName: "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
  },
  moderate: {
    className: "text-amber-600 dark:text-amber-400",
    badgeClassName: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  },
  high: {
    className: "text-red-600 dark:text-red-400",
    badgeClassName: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  },
} as const;

/**
 * Interpretation bands. For BASDAI, a score of >= 4 is the long-standing
 * threshold used to describe "active disease"; below that we split at 2.5,
 * roughly the low-activity level seen in cohort studies. BASFI has no formal
 * clinical cut-off, so it is banded descriptively. These bands are
 * informational only — the app does not give clinical advice.
 */
export function severity(type: InstrumentType, score: number): Severity {
  if (type === "basdai") {
    if (score >= 4) {
      return {
        label: "Active disease",
        description: "At or above the score of 4 commonly used to describe active AS — worth reviewing with your clinician.",
        ...TONE.high,
      };
    }
    if (score >= 2.5) {
      return {
        label: "Moderate activity",
        description: "Above a typical low-activity level, but below the usual active-disease threshold of 4. Keep an eye on the trend.",
        ...TONE.moderate,
      };
    }
    return {
      label: "Lower activity",
      description: "Below the score of 4 often used to describe active disease.",
      ...TONE.calm,
    };
  }
  // BASFI — no formal cut-off; bands are descriptive.
  if (score >= 7) {
    return {
      label: "High limitation",
      description: "Everyday activities are hard right now. Watch it alongside BASDAI and mention it to your clinician.",
      ...TONE.high,
    };
  }
  if (score >= 4) {
    return {
      label: "Moderate limitation",
      description: "Some activities are harder than easy. The trend over time matters more than any single score.",
      ...TONE.moderate,
    };
  }
  return {
    label: "Low limitation",
    description: "Most everyday activities are relatively easy at the moment.",
    ...TONE.calm,
  };
}
