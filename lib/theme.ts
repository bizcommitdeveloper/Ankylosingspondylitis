import { useColorScheme } from "react-native";
import type { Tone } from "./scoring";

export interface ToneColors {
  fg: string;
  bg: string;
}

export interface Theme {
  dark: boolean;
  bg: string;
  card: string;
  cardAlt: string;
  border: string;
  text: string;
  subtext: string;
  muted: string;
  brand: string;
  brandDark: string;
  onBrand: string;
  danger: string;
  tones: Record<Tone, ToneColors>;
}

const light: Theme = {
  dark: false,
  bg: "#f8fafc",
  card: "#ffffff",
  cardAlt: "#f1f5f9",
  border: "#e2e8f0",
  text: "#0f172a",
  subtext: "#475569",
  muted: "#94a3b8",
  brand: "#0d9488",
  brandDark: "#0f766e",
  onBrand: "#ffffff",
  danger: "#dc2626",
  tones: {
    calm: { fg: "#0f766e", bg: "#ccfbf1" },
    moderate: { fg: "#b45309", bg: "#fef3c7" },
    high: { fg: "#b91c1c", bg: "#fee2e2" },
  },
};

const dark: Theme = {
  dark: true,
  bg: "#020617",
  card: "#0f172a",
  cardAlt: "#1e293b",
  border: "#1e293b",
  text: "#f1f5f9",
  subtext: "#cbd5e1",
  muted: "#64748b",
  brand: "#2dd4bf",
  brandDark: "#14b8a6",
  onBrand: "#04201d",
  danger: "#f87171",
  tones: {
    calm: { fg: "#5eead4", bg: "#134e4a" },
    moderate: { fg: "#fcd34d", bg: "#4d3908" },
    high: { fg: "#fca5a5", bg: "#4c1414" },
  },
};

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}
