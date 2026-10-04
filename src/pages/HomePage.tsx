import { useSearchParams } from "react-router-dom";
import { categories, exercises, searchExercises } from "../data";
import { CategoryCard, ExerciseCard } from "../components/Cards";
import { SearchIcon } from "../components/icons";

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const results = q.trim() ? searchExercises(q) : [];

  function onChange(value: string) {
    if (value) setParams({ q: value }, { replace: true });
    else setParams({}, { replace: true });
  }

  return (
    <>
      <section className="hero">
        <h1>Physiotherapy exercises, made simple</h1>
        <p>Clear, step-by-step instructions for {exercises.length} exercises across {categories.length} areas of the body.</p>
      </section>

      <div className="search">
        <SearchIcon size={18} />
        <input
          type="search"
          inputMode="search"
          placeholder="Search exercises (e.g. neck, squat, balance)…"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search exercises"
        />
      </div>

      {q.trim() ? (
        <>
          <p className="count-note">
            {results.length} result{results.length === 1 ? "" : "s"} for “{q.trim()}”
          </p>
          {results.length ? (
            <div className="grid cols-2" style={{ marginTop: 10 }}>
              {results.map((e) => (
                <ExerciseCard key={e.slug} exercise={e} />
              ))}
            </div>
          ) : (
            <p className="empty">No exercises match that. Try a body part or movement.</p>
          )}
        </>
      ) : (
        <>
          <h2 className="section-title">Browse by area</h2>
          <div className="grid cols-2">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
