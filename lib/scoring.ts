import type { InstrumentType } from "./types";

/**
 * BASDAI — Bath Ankylosing Spondylitis Disease Activity Index.
 * Score = ( Q1 + Q2 + Q3 + Q4 + (Q5 + Q6) / 2 ) / 5   → 0–10
 */
export function basdaiScore(answers: number[]): number {
  const [q1, q2, q3, q4, q5, q6] = answers;
  return (q1 + q2 + q3 + q4 + (q5 + q6) / 2) / 5;
}

/**
 * BASFI — Bath Ankylosing Spondylitis Functional Index.
 * Score = mean of the ten answers → 0–10
 */
export function basfiScore(answers: number[]): number {
  if (answers.length === 0) return 0;
  return answers.reduce((total, value) => total + value, 0) / answers.length;
}

export function computeScore(type: InstrumentType, answers: number[]): number {
  const raw = type === "basdai" ? basdaiScore(answers) : basfiScore(answers);
  return Math.round(raw * 10) / 10;
}

/** Semantic tone, mapped to concrete colours by the theme. */
export type Tone = "calm" | "moderate" | "high";

export interface Severity {
  label: string;
  /** One short, hedged sentence of context. Informational only. */
  description: string;
  tone: Tone;
}

/**
 * Interpretation bands. For BASDAI, a score of >= 4 is the long-standing
 * threshold used to describe "active disease"; below that we split at 2.5.
 * BASFI has no formal clinical cut-off, so it is banded descriptively. These
 * bands are informational only — the app does not give clinical advice.
 */
export function severity(type: InstrumentType, score: number): Severity {
  if (type === "basdai") {
    if (score >= 4) {
      return {
        label: "Active disease",
        description: "At or above the score of 4 commonly used to describe active AS — worth reviewing with your clinician.",
        tone: "high",
      };
    }
    if (score >= 2.5) {
      return {
        label: "Moderate activity",
        description: "Above a typical low-activity level, but below the usual active-disease threshold of 4. Keep an eye on the trend.",
        tone: "moderate",
      };
    }
    return {
      label: "Lower activity",
      description: "Below the score of 4 often used to describe active disease.",
      tone: "calm",
    };
  }
  if (score >= 7) {
    return {
      label: "High limitation",
      description: "Everyday activities are hard right now. Watch it alongside BASDAI and mention it to your clinician.",
      tone: "high",
    };
  }
  if (score >= 4) {
    return {
      label: "Moderate limitation",
      description: "Some activities are harder than easy. The trend over time matters more than any single score.",
      tone: "moderate",
    };
  }
  return {
    label: "Low limitation",
    description: "Most everyday activities are relatively easy at the moment.",
    tone: "calm",
  };
}
