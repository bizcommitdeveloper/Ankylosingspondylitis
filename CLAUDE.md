# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

**Physiosolution Exercises** — a responsive React website presenting 148
physiotherapy exercises (16 categories). Mobile/tablet-first. Exercise content
is the owner's (Physiosolution); exercise media is being added.

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

- Each exercise has: `slug`, `title`, `summary` (one sentence: what it's for),
  `steps[]`, `howMuch`, `category`, `categorySlug`, `image` (null until supplied).
- **Images:** set `image` to a URL or a `public/`-relative path; cards and the
  detail page swap from placeholder to the image automatically
  (`components/ImagePlaceholder.tsx`).

## Product decisions (keep these unless the owner asks otherwise)

- **Exercise page is deliberately minimal** so it fits one phone screen: image,
  title, summary, *How to do it* (steps), *How much*. The owner removed "What it
  does", "Common mistakes", the stop-and-check warnings and FAQs — don't add
  them back, and keep summaries free of references to removed sections.
- **No footer.** The medical disclaimer, copyright and source attribution were
  removed at the owner's request.

## Conventions

- Routes: `/` (home: search + category grid), `/category/:slug`,
  `/exercise/:slug`. Served as a SPA (hosts rewrite all paths to `index.html`).
- Icons are inline SVGs in `components/icons.tsx` (`IconProps = SVGProps & {size?}`);
  `tsconfig` has `noUnusedLocals`, so remove imports you stop using.
- Keep styling in `styles.css` using the existing CSS variables; match the card
  and `.block` patterns already there.

## Deploy

Connected to Vercel (push → preview; merge to `main` → production). Previews are
behind Vercel Deployment Protection. `firebase.json` is an optional alternative.

## Workflow

- Develop on the feature branch; never push directly to `main` — land via PR.
- `npm run build` is the gate (type-check + bundle).
