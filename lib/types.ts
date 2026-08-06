export type InstrumentType = "basdai" | "basfi";

/** A single completed questionnaire, stored at users/{uid}/entries/{entryId}. */
export interface Entry {
  id?: string;
  type: InstrumentType;
  /** Raw answers, one per question, each on a 0–10 scale. */
  answers: number[];
  /** Computed index score, 0–10. */
  score: number;
  note?: string;
  /** ISO date (yyyy-mm-dd) the assessment refers to. */
  referenceDate: string;
  /** Creation time in ms since epoch. */
  createdAt: number;
}

export type NewEntry = Omit<Entry, "id" | "createdAt">;
