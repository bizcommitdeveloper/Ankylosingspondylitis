# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

**Physiosolution Exercises** — a responsive React website presenting 148
physiotherapy exercises (16 categories) with step-by-step English instructions.
Mobile/tablet-first. Instructions sourced from physiosolution.com (used with the
owner's permission); exercise images are added later (placeholders for now).

## Stack

- Vite + React 18 + TypeScript (static SPA), react-router-dom.
- Plain CSS with CSS variables in `src/styles.css` (light/dark via
  `prefers-color-scheme`). No UI framework, no Tailwind.

## Commands

```bash
npm run dev        # dev server
npm run build      # tsc --noEmit + vite build → dist/  (the gate — keep it green)
npm run typecheck  # tsc --noEmit
npm run preview    # serve the build
```

## Data model

All content lives in `src/data/exercises.json`, loaded and typed via
`src/data/index.ts` (`Exercise`, `Category`, plus `getExercise`, `getCategory`,
`exercisesInCategory`, `searchExercises`). The UI renders entirely from this
data — adding/editing an exercise is a data change, not a code change.

- Each exercise has: `slug`, `title`, `summary`, `whatItDoes`, `steps[]`,
  `howMuch`, `commonMistakes[]`, `warnings[]`, `faqs[{q,a}]`, `category`,
  `categorySlug`, `image` (null until supplied).
- **Images:** set `image` to a URL or a `public/`-relative path; cards and the
  detail hero swap from placeholder to the image automatically
  (`components/ImagePlaceholder.tsx`). No code change needed.

## Conventions

- Routes: `/` (home: search + category grid), `/category/:slug`,
  `/exercise/:slug`. Served as a SPA (Firebase Hosting rewrites all to
  `index.html`).
- Icons are inline SVGs in `components/icons.tsx` (`IconProps = SVGProps & {size?}`).
- Keep styling in `styles.css` using the existing CSS variables; match the card
  and `.block` patterns already there.
- Content disclaimer + Physiosolution attribution live in `components/Layout.tsx`
  — keep them. This is informational, not medical advice.

## Deploy

Static build → `dist/`. `firebase.json` is set up for Firebase Hosting
(`firebase deploy --only hosting`). Any static host with an SPA fallback works.

## Workflow

- Develop on the feature branch; never push directly to `main` — land via PR.
- `npm run build` is the gate (type-check + bundle).
