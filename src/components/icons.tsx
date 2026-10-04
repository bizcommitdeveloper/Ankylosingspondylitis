import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function I({ children, size = 20, ...p }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </I>
);
export const Chevron = (p: IconProps) => (
  <I {...p}>
    <path d="m9 18 6-6-6-6" />
  </I>
);
export const Back = (p: IconProps) => (
  <I {...p}>
    <path d="m15 18-6-6 6-6" />
  </I>
);
export const Info = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </I>
);
export const Steps = (p: IconProps) => (
  <I {...p}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </I>
);
export const Clock = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </I>
);
export const Alert = (p: IconProps) => (
  <I {...p}>
    <path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </I>
);
export const Caution = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3v18M3 7.5 12 12l9-4.5" opacity="0" />
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </I>
);
export const Plus = (p: IconProps) => (
  <I {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
export const Dumbbell = (p: IconProps) => (
  <I {...p}>
    <path d="M6.5 6.5 17.5 17.5M4 8l2-2M8 4 6 6M16 20l2-2M20 16l-2 2M6 10 4 8m0 0L2 10m14 10 2-2m0 0 2 2" opacity="0" />
    <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
  </I>
);
export const ImageIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </I>
);
export const HelpCircle = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" />
  </I>
);
