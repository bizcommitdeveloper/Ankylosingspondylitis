import { Link, useParams } from "react-router-dom";
import { exercisesInCategory, getCategory } from "../data";
import { ExerciseCard } from "../components/Cards";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const category = getCategory(slug);
  const list = exercisesInCategory(slug);

  if (!category) {
    return (
      <p className="empty">
        Category not found. <Link to="/">Back to all exercises</Link>.
      </p>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: 22, margin: "18px 0 2px", letterSpacing: "-0.02em" }}>{category.name}</h1>
      <p className="count-note">
        {list.length} exercise{list.length === 1 ? "" : "s"}
      </p>
      <div className="grid cols-2" style={{ marginTop: 12 }}>
        {list.map((e) => (
          <ExerciseCard key={e.slug} exercise={e} />
        ))}
      </div>
    </>
  );
}
