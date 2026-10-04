import raw from "./exercises.json";

export interface Faq {
  q: string;
  a: string;
}

export interface Exercise {
  slug: string;
  title: string;
  summary: string;
  whatItDoes?: string;
  steps?: string[];
  howMuch?: string;
  commonMistakes?: string[];
  warnings?: string[];
  faqs?: Faq[];
  category: string;
  categorySlug: string;
  image: string | null;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

interface Data {
  generatedFrom: string;
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
