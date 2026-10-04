import { Link } from "react-router-dom";
import type { Category, Exercise } from "../data";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Chevron, Dumbbell } from "./icons";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link className="card cat-card" to={`/category/${category.slug}`}>
      <span className="cat-icon">
        <Dumbbell size={22} />
      </span>
      <span>
        <span className="cat-name">{category.name}</span>
        <br />
        <span className="cat-count">
          {category.count} exercise{category.count === 1 ? "" : "s"}
        </span>
      </span>
      <Chevron className="chev" />
    </Link>
  );
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link className="card ex-card" to={`/exercise/${exercise.slug}`}>
      <ImagePlaceholder src={exercise.image} alt={exercise.title} thumb />
      <span className="ex-info">
        <span className="ex-title">{exercise.title}</span>
        <span className="ex-sub">{exercise.summary}</span>
      </span>
      <Chevron className="chev" />
    </Link>
  );
}
