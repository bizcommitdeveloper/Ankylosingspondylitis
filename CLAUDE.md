# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

**Physiosolution Exercises** — a responsive React website presenting 148
physiotherapy exercises (16 categories). Mobile/tablet-first. Exercise content
is the owner's (Physiosolution). 16 exercises have animated GIF demonstrations;
the rest show a "Demonstration coming soon" placeholder.

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
  `steps[]`, `howMuch`, `category`, `categorySlug`, `image` (null until supplied),
  and `imageCredit` (`{ author, license, source }`) when `image` is set.
- **Media:** animated GIFs live in `public/gifs/<slug>.gif` and `image` is
  `"/gifs/<slug>.gif"`. `components/ExerciseMedia.tsx` renders the GIF (or the
  placeholder when `image` is null) on cards and the detail page.

## Exercise media rules

- **Licensed/royalty-free only** (owner's decision). Never use GIFs from random
  websites, GIPHY/Tenor search results or stock sites without a licence.
- Current sources (all via Wikimedia Commons):
  - CDC "Strength training for older adults" GIFs — **public domain**, no credit
    shown.
  - Everkinetic drawings — **CC BY-SA 3.0**; two frames combined into a GIF, so
    the author is `"Everkinetic (adapted)"`. A small credit line is shown under
    the animation because the licence requires it.
- The credit line renders automatically for any `imageCredit` whose `license`
  is not `"Public domain"` — always fill `imageCredit` accurately.
- **Only map an animation to an exercise after checking it matches that
  exercise's steps.** A wrong demonstration is worse than a placeholder (e.g.
  the two-leg bridge GIF is not used for Single Leg Bridge).
- Finding more media: `scripts/commons/` builds a list of Commons files and
  matches them to every exercise → `docs/commons-candidates.md`. Record each
  visual check in `scripts/commons/data/verdicts.json`. Status and next steps
  are in `HANDOFF.md` — read it first when picking up the media work.

## Product decisions (keep these unless the owner asks otherwise)

- **Exercise page is deliberately minimal** so it fits one phone screen:
  animation, title, summary, *How to do it* (steps), *How much*. The owner
  removed "What it does", "Common mistakes", the stop-and-check warnings and
  FAQs — don't add them back, and keep summaries free of references to removed
  sections.
- **No footer.** The medical disclaimer, copyright and source attribution were
  removed at the owner's request. (The per-animation CC BY-SA credit is the one
  exception — it's a licence requirement, not site attribution.)

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
