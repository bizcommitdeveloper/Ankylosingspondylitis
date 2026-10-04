# Physiosolution Exercises

A responsive React website (tablet/mobile-first) that presents a library of
**148 physiotherapy exercises** across **16 body areas**, each with clear,
step-by-step English instructions:

- **What it does** · **How to do it** (numbered steps) · **How much** ·
  **Common mistakes** · **When to stop and get checked** · **FAQs**
- Browse by area, or search across every exercise.

> **Images:** exercise photos/illustrations are **coming later** — each exercise
> currently shows a tidy placeholder. When an `image` URL is added to the data,
> it displays automatically (see "Adding images" below).

> **Not medical advice.** The instructions are general guidance, not a personal
> prescription.

## Tech stack

- **Vite + React + TypeScript** (static single-page app)
- **react-router-dom** for routing
- Plain CSS with CSS variables (light/dark via `prefers-color-scheme`); no UI framework

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
```

## Deploying (open it on your phone, no app build needed)

The build is a static site; `firebase.json` is preconfigured for **Firebase Hosting**:

```bash
npm run build
npm i -g firebase-tools
firebase login
firebase deploy --only hosting     # prints a public https URL to open on any device
```

(Any static host works — Netlify, Vercel, GitHub Pages, S3 — point it at `dist/`
with a SPA fallback to `index.html`.)

## Content & data

Exercise instructions are sourced from **physiosolution.com** (used with the
owner's permission) and stored as structured data in
[`src/data/exercises.json`](./src/data/exercises.json):

```jsonc
{
  "categories": [{ "name": "Neck Exercises", "slug": "neck-exercises", "count": 9 }],
  "exercises": [{
    "slug": "chin-tucks",
    "title": "Chin Tucks",
    "summary": "…",
    "whatItDoes": "…",
    "steps": ["…"],
    "howMuch": "…",
    "commonMistakes": ["…"],
    "warnings": ["…"],
    "faqs": [{ "q": "…", "a": "…" }],
    "category": "Neck Exercises",
    "categorySlug": "neck-exercises",
    "image": null
  }]
}
```

### Adding images later

Set each exercise's `image` field in `exercises.json` to an image URL or a path
under `public/` (e.g. `"/images/chin-tucks.jpg"`). The card thumbnails and the
detail hero switch from the placeholder to the real image automatically — no
code changes needed.

## Project structure

```
src/
  main.tsx                # entry
  App.tsx                 # routes (/, /category/:slug, /exercise/:slug)
  styles.css              # theme + responsive layout
  data/
    exercises.json        # the 148-exercise dataset
    index.ts              # typed data + lookup/search helpers
  components/
    Layout.tsx            # header + footer (disclaimer, attribution)
    Cards.tsx             # CategoryCard, ExerciseCard
    ImagePlaceholder.tsx  # shows a placeholder until image is set
    icons.tsx             # inline SVG icons
  pages/
    HomePage.tsx          # hero + search + category grid
    CategoryPage.tsx      # exercises within a category
    ExercisePage.tsx      # full instructions for one exercise
firebase.json             # Firebase Hosting config (serves dist/)
```
