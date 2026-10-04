import type { MediaCredit } from "../data";
import { ImageIcon } from "./icons";

interface Props {
  src: string | null;
  alt: string;
  thumb?: boolean;
  credit?: MediaCredit;
}

/**
 * Animated demonstration (GIF) for an exercise, or a placeholder when none is
 * available yet. A credit line is shown only when the media's license requires
 * attribution (public-domain media needs none).
 */
export function ExerciseMedia({ src, alt, thumb, credit }: Props) {
  const cls = thumb ? "media thumb" : "media";

  if (!src) {
    return (
      <div className={`${cls} empty-media`} role="img" aria-label={`${alt} — demonstration coming soon`}>
        <ImageIcon size={thumb ? 22 : 30} />
        {!thumb && <span className="label">Demonstration coming soon</span>}
      </div>
    );
  }

  const needsCredit = !thumb && credit && credit.license !== "Public domain";
  return (
    <figure className="media-figure">
      <div className={cls}>
        <img src={src} alt={`${alt} — animated demonstration`} loading="lazy" decoding="async" />
      </div>
      {needsCredit && (
        <figcaption className="media-credit">
          Animation:{" "}
          <a href={credit.source} target="_blank" rel="noopener noreferrer">
            {credit.author}
          </a>
          , {credit.license}
        </figcaption>
      )}
    </figure>
  );
}
