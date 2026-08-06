import type { SVGProps } from "react";

/** Shared stroke-style icon set (no external assets). */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </Icon>
  );
}

export function GaugeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 14l4-4" />
      <path d="M3.5 18a9 9 0 1 1 17 0" />
      <circle cx="12" cy="14" r="1" />
    </Icon>
  );
}

export function TrendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 14l3-3 3 3 5-6" />
    </Icon>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
      <path d="M9.5 12l1.8 1.8 3.2-3.6" />
    </Icon>
  );
}

export function SunriseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3v3M5.5 8.5 7 10M18.5 8.5 17 10M3 18h18M4 14a8 8 0 0 1 16 0" />
      <path d="M8.5 18a3.5 3.5 0 0 1 7 0" />
    </Icon>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Icon>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

export function HeartPulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A3.5 3.5 0 0 0 12 6 3.5 3.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
      <path d="M6 12h2l1.5-2.5L12 14l1.5-3 1 1.5H18" />
    </Icon>
  );
}
