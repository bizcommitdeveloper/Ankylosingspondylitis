/**
 * Patient-facing educational copy, kept in one place so pages, the onboarding
 * flow, and the in-app "Learn" page all stay consistent and easy to update.
 *
 * Everything here is informational only. It is drawn from public patient
 * resources (see SOURCES) and is deliberately hedged — the app must never read
 * as diagnosis or medical advice.
 */
import type { InstrumentType } from "./types";

export interface Source {
  label: string;
  url: string;
}

export const NOT_ADVICE =
  "This app records and visualises your own answers. It is not a diagnostic tool and does not give medical advice. Always talk to your rheumatologist or GP about your symptoms and treatment.";

export interface Highlight {
  title: string;
  body: string;
}

export const AS_OVERVIEW = {
  title: "What is Ankylosing Spondylitis?",
  summary:
    "Ankylosing spondylitis (AS) is a type of inflammatory arthritis that mainly affects the spine and the sacroiliac joints, where the spine meets the pelvis. Ongoing inflammation causes pain and stiffness and, over time, can reduce spinal flexibility. It is a long-term condition with no cure — but staying active and working with your care team can help you manage symptoms and protect your mobility.",
  highlights: [
    {
      title: "Where it's felt",
      body: "Most often the lower back, buttocks and hips, and sometimes the neck. AS can also affect other joints, cause eye inflammation (uveitis), and bring on fatigue.",
    },
    {
      title: "Morning stiffness",
      body: "Stiffness lasting more than 30 minutes on waking, or after sitting still, is a classic feature. It usually eases with movement rather than with rest.",
    },
    {
      title: "Better with movement",
      body: "Symptoms tend to improve with gentle activity and regular exercise, and get worse after long periods of rest.",
    },
    {
      title: "It varies over time",
      body: "AS often comes in flares. Recording how you feel turns scattered good and bad days into a pattern you and your clinician can actually see.",
    },
  ] as Highlight[],
  seeDoctor:
    "See a doctor about slow-onset low back or buttock pain that is worse in the morning or wakes you at night, or any red, painful eye with light sensitivity or blurred vision.",
};

export interface InstrumentInfo {
  name: string;
  full: string;
  tagline: string;
  measures: string;
  scale: string;
  formula: string;
  interpretation: string;
  frequency: string;
}

export const INSTRUMENT_INFO: Record<InstrumentType, InstrumentInfo> = {
  basdai: {
    name: "BASDAI",
    full: "Bath Ankylosing Spondylitis Disease Activity Index",
    tagline: "How active your AS feels",
    measures:
      "How active your AS has felt over the past week: fatigue, spinal pain, pain or swelling in other joints, tender areas, and the severity and duration of morning stiffness.",
    scale: "Six questions, each answered 0–10.",
    formula: "Score = ( Q1 + Q2 + Q3 + Q4 + average of Q5 and Q6 ) ÷ 5, giving a 0–10 result.",
    interpretation:
      "Higher means more active disease. A score of 4 or more is the threshold widely used to describe “active disease” and is often referenced when considering biologic treatment — but it is a long-standing rule of thumb, not a strict rule, so read it alongside how you actually feel.",
    frequency: "Many people record it weekly, or just before a clinic visit, to show the trend.",
  },
  basfi: {
    name: "BASFI",
    full: "Bath Ankylosing Spondylitis Functional Index",
    tagline: "How easily you move day to day",
    measures:
      "How easily you can do ten everyday activities — putting on socks, bending, reaching, getting up from the floor or a chair, standing, and climbing stairs — over the past week.",
    scale: "Ten questions, each answered 0 (easy) to 10 (impossible).",
    formula: "Score = the average of all ten answers, giving a 0–10 result.",
    interpretation:
      "Higher means more functional limitation. There is no formal clinical cut-off — BASFI is most useful watched over time to see whether everyday function is improving or declining.",
    frequency: "Recording it alongside BASDAI gives a fuller picture of activity and function.",
  },
};

export const TRACKING_BENEFITS: Highlight[] = [
  {
    title: "See the real trend",
    body: "One bad day isn't the whole story. A line over weeks and months shows whether things are genuinely improving.",
  },
  {
    title: "Better clinic visits",
    body: "Bring objective scores to your rheumatologist instead of trying to recall how the last few months felt.",
  },
  {
    title: "Spot what helps",
    body: "A note beside each score helps you connect flares to sleep, stress, exercise or medication changes.",
  },
  {
    title: "Private by default",
    body: "Your entries are tied to your account and visible only to you.",
  },
];

export const SOURCES: Source[] = [
  {
    label: "Mayo Clinic — Ankylosing spondylitis",
    url: "https://www.mayoclinic.org/diseases-conditions/ankylosing-spondylitis/symptoms-causes/syc-20354808",
  },
  {
    label: "Cleveland Clinic — Ankylosing spondylitis",
    url: "https://my.clevelandclinic.org/health/diseases/ankylosing-spondylitis",
  },
  {
    label: "Spondylitis Association of America — BASDAI",
    url: "https://spondylitis.org/basdai-calculator/",
  },
  {
    label: "Physiopedia — The Bath Indices",
    url: "https://www.physio-pedia.com/The_Bath_Indices",
  },
];
