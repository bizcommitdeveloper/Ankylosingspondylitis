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
  /** Tailwind text colour class. */
  className: string;
}

/**
 * Interpretation bands. A BASDAI of >= 4 is the widely used threshold for
 * "active disease". BASFI has no formal cut-off, so we band it descriptively.
 * These are informational only — the app does not give clinical advice.
 */
export function severity(type: InstrumentType, score: number): Severity {
  if (type === "basdai") {
    if (score >= 4) {
      return { label: "Active disease (≥ 4)", className: "text-red-600 dark:text-red-400" };
    }
    return { label: "Below active threshold", className: "text-brand-700 dark:text-brand-300" };
  }
  // BASFI
  if (score >= 7) return { label: "High functional limitation", className: "text-red-600 dark:text-red-400" };
  if (score >= 4) return { label: "Moderate functional limitation", className: "text-amber-600 dark:text-amber-400" };
  return { label: "Low functional limitation", className: "text-brand-700 dark:text-brand-300" };
}
