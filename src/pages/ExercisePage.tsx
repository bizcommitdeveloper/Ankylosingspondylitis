import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getExercise } from "../data";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { Caution, Clock, Steps } from "../components/icons";

export function ExercisePage() {
  const { slug = "" } = useParams();
  const ex = getExercise(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!ex) {
    return (
      <p className="empty">
        Exercise not found. <Link to="/">Back to all exercises</Link>.
      </p>
    );
  }

  return (
    <div className="detail">
      <div style={{ marginTop: 16, marginBottom: 10 }}>
        <Link className="chip" to={`/category/${ex.categorySlug}`}>
          {ex.category}
        </Link>
      </div>

      <ImagePlaceholder src={ex.image} alt={ex.title} />

      <h1>{ex.title}</h1>
      {ex.summary && <p className="lead">{ex.summary}</p>}

      {ex.steps && ex.steps.length > 0 && (
        <section className="block">
          <h2>
            <Steps size={18} /> How to do it
          </h2>
          <ol className="steps">
            {ex.steps.map((s, i) => (
              <li key={i}>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {ex.howMuch && (
        <section className="block">
          <h2>
            <Clock size={18} /> How much
          </h2>
          <p className="dose">{ex.howMuch}</p>
        </section>
      )}

      {ex.warnings && ex.warnings.length > 0 && (
        <section className="block warn">
          <h2>
            <Caution size={18} /> Stop and get checked if
          </h2>
          <ul className="bullets">
            {ex.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
