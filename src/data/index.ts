import raw from "./exercises.json";

/** Provenance of an exercise animation (kept for every file, shown when required). */
export interface MediaCredit {
  author: string;
  license: string;
  /** Page the file came from (e.g. its Wikimedia Commons file page). */
  source: string;
}

export interface Exercise {
  slug: string;
  title: string;
  summary: string;
  steps?: string[];
  howMuch?: string;
  category: string;
  categorySlug: string;
  /** Path to the animated demonstration under public/ (e.g. "/gifs/<slug>.gif"), or null. */
  image: string | null;
  imageCredit?: MediaCredit;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

interface Data {
  categories: Category[];
  exercises: Exercise[];
}

const data = raw as Data;

export const categories: Category[] = data.categories;
export const exercises: Exercise[] = data.exercises;

export function getExercise(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function exercisesInCategory(slug: string): Exercise[] {
  return exercises.filter((e) => e.categorySlug === slug);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return exercises.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q),
  );
}
