export type InstrumentType = "basdai" | "basfi";

/**
 * A single completed questionnaire, stored under
 * `users/{uid}/entries/{entryId}` in Firestore.
 */
export interface Entry {
  id?: string;
  type: InstrumentType;
  /** Raw answers, one per question, each on a 0–10 scale. */
  answers: number[];
  /** Computed index score, 0–10. */
  score: number;
  /** Optional free-text note from the user. */
  note?: string;
  /** ISO date (yyyy-mm-dd) the assessment refers to. */
  referenceDate: string;
  /** Creation time in ms since epoch (derived from the server timestamp). */
  createdAt: number;
}

/** Shape used when writing a new entry (id/createdAt are assigned on save). */
export type NewEntry = Omit<Entry, "id" | "createdAt">;
