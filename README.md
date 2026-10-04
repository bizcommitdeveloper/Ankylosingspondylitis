# Physiosolution Exercises

A responsive React website (tablet/mobile-first) that presents a library of
**148 physiotherapy exercises** across **16 body areas**. Each exercise page is
kept short enough to fit on a phone screen:

- an animated demonstration (16 exercises so far; a placeholder for the rest),
- a one-line summary of what the exercise is for,
- **How to do it** — numbered steps,
- **How much** — reps, holds and frequency.

Browse by area, or search across every exercise.

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

## Deploying

The repository is connected to **Vercel**: every push builds a preview, and
merging to `main` deploys production. (Previews sit behind Vercel's Deployment
Protection; turn it off in the Vercel project settings to share links publicly.)

`firebase.json` is also included if you prefer Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

## Content & data

All content lives in [`src/data/exercises.json`](./src/data/exercises.json):

```jsonc
{
  "categories": [{ "name": "Neck Exercises", "slug": "neck-exercises", "count": 9 }],
  "exercises": [{
    "slug": "chin-tucks",
    "title": "Chin Tucks",
    "summary": "Chin tucks for neck pain and forward head posture.",
    "steps": ["…"],
    "howMuch": "…",
    "category": "Neck Exercises",
    "categorySlug": "neck-exercises",
    "image": null
  }]
}
```

### Exercise animations

Animated GIFs live in [`public/gifs/`](./public/gifs) as `<slug>.gif`. To add one,
put the file there and set the exercise's `image` and `imageCredit`:

```jsonc
"image": "/gifs/calf-raises.gif",
"imageCredit": {
  "author": "Centers for Disease Control and Prevention",
  "license": "Public domain",
  "source": "https://commons.wikimedia.org/wiki/File:Toe_stand-CDC_strength_training_for_older_adults.gif"
}
```

Cards and the detail page switch from the placeholder to the animation
automatically. Only use media you're licensed to use:

| Source | Licence | Exercises | Credit shown |
| --- | --- | --- | --- |
| CDC *Strength training for older adults* (Wikimedia Commons) | Public domain | 13 | No |
| Everkinetic (Wikimedia Commons), two frames combined | CC BY-SA 3.0 | 3 (glute bridge, ankle circles, cervical isometric) | Yes — required by the licence |

A small "Animation: …" credit line appears under any animation whose licence
isn't public domain.

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
    Layout.tsx            # sticky header
    Cards.tsx             # CategoryCard, ExerciseCard
    ExerciseMedia.tsx     # animated GIF (+ licence credit) or placeholder
    icons.tsx             # inline SVG icons
  pages/
    HomePage.tsx          # hero + search + category grid
    CategoryPage.tsx      # exercises within a category
    ExercisePage.tsx      # animation, summary, steps, how much
public/
  gifs/                   # exercise animations, <slug>.gif
scripts/commons/          # Wikimedia Commons media search + matching (not shipped)
docs/
  commons-candidates.md   # every exercise vs. matching Commons media (generated)
HANDOFF.md                # current status and next steps
firebase.json             # optional Firebase Hosting config (serves dist/)
```
