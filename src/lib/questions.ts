import type { InstrumentType } from "./types";

export interface SliderTick {
  value: number;
  label: string;
}

export interface Question {
  /** Question text shown to the user. */
  text: string;
  /** Label at the low (0) end of the scale. */
  minLabel: string;
  /** Label at the high (10) end of the scale. */
  maxLabel: string;
  min: number;
  max: number;
  step: number;
  /** Optional tick marks with custom labels (e.g. hours for stiffness duration). */
  ticks?: SliderTick[];
  /** Optional formatter for the live numeric read-out. */
  formatValue?: (value: number) => string;
}

export interface Instrument {
  type: InstrumentType;
  title: string;
  subtitle: string;
  /** Recall/instruction line shown above the questions. */
  instruction: string;
  source: string;
  questions: Question[];
}

const SEVERITY = { minLabel: "None", maxLabel: "Very severe" };

export const BASDAI: Instrument = {
  type: "basdai",
  title: "BASDAI",
  subtitle: "Bath Ankylosing Spondylitis Disease Activity Index",
  instruction:
    "Move each slider to the number that most closely corresponds to your condition during the past week.",
  source: "BC Ministry of Health / Bath AS Disease Activity Index",
  questions: [
    {
      text: "How would you describe the overall level of fatigue/tiredness you have experienced?",
      ...SEVERITY,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      text: "How would you describe the overall level of inflammatory neck, back or hip pain you have had?",
      ...SEVERITY,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      text: "How would you describe the overall level of pain/swelling in joints other than neck, back or hips you have had?",
      ...SEVERITY,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      text: "How would you describe the overall level of discomfort you have had from any areas tender to touch or pressure?",
      ...SEVERITY,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      text: "How would you describe the overall level of morning stiffness you have had from the time you wake up?",
      ...SEVERITY,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      text: "How long does your morning stiffness last from the time you wake up?",
      minLabel: "0 hrs",
      maxLabel: "2+ hrs",
      min: 0,
      max: 10,
      step: 2.5,
      ticks: [
        { value: 0, label: "0 hrs" },
        { value: 2.5, label: "½ hr" },
        { value: 5, label: "1 hr" },
        { value: 7.5, label: "1½ hr" },
        { value: 10, label: "2+ hrs" },
      ],
      formatValue: (v) => {
        const hours = v / 5; // 0–10 scale maps to 0–2 hours
        if (hours === 0) return "0 hrs";
        if (hours === 0.5) return "½ hr";
        if (hours === 1) return "1 hr";
        if (hours === 1.5) return "1½ hr";
        return "2+ hrs";
      },
    },
  ],
};

const ABILITY = { minLabel: "Easy", maxLabel: "Impossible" };

export const BASFI: Instrument = {
  type: "basfi",
  title: "BASFI",
  subtitle: "Bath Ankylosing Spondylitis Functional Index",
  instruction:
    "For each activity, move the slider to indicate your level of ability over the past 7 days.",
  source: "Ankylosing Spondylitis International Federation (ASIF)",
  questions: [
    { text: "Putting on your socks or tights without help or aids (e.g. sock aid).", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Bending forward from the waist to pick up a pen from the floor without an aid.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Reaching up to a high shelf without help or aids (e.g. helping hand).", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Getting up out of an armless dining room chair without using your hands or any other help.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Getting up off the floor without help from lying on your back.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Standing unsupported for 10 minutes without discomfort.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Climbing 12–15 steps without using a handrail or walking aid, one foot on each step.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Looking over your shoulder without turning your body.", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Doing physically demanding activities (e.g. physiotherapy exercises, gardening or sports).", ...ABILITY, min: 0, max: 10, step: 0.1 },
    { text: "Doing a full day's activities whether it be at home or at work.", ...ABILITY, min: 0, max: 10, step: 0.1 },
  ],
};

export const INSTRUMENTS: Record<InstrumentType, Instrument> = {
  basdai: BASDAI,
  basfi: BASFI,
};

export function getInstrument(type: InstrumentType): Instrument {
  return INSTRUMENTS[type];
}
