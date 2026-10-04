import { ImageIcon } from "./icons";

interface Props {
  src: string | null;
  alt: string;
  thumb?: boolean;
}

/**
 * Exercise images aren't available yet (the source site has none), so every
 * exercise renders a tidy placeholder for now. When an `image` URL is added to
 * the data, it shows automatically.
 */
export function ImagePlaceholder({ src, alt, thumb }: Props) {
  if (src) {
    return <img className={thumb ? "img-ph thumb" : "img-ph"} src={src} alt={alt} loading="lazy" style={{ objectFit: "cover" }} />;
  }
  return (
    <div className={thumb ? "img-ph thumb" : "img-ph"} role="img" aria-label={`${alt} — image coming soon`}>
      <ImageIcon size={thumb ? 22 : 30} />
      {!thumb && <span className="label">Image coming soon</span>}
    </div>
  );
}
