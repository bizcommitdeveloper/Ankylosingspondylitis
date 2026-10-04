# Handoff — Physiosolution Exercises

_Last updated: 4 October 2026._ Read this with `CLAUDE.md`, which holds the
standing rules.

## Where things stand

- **Live site (`main`, deployed by Vercel):** a React website with
  **148 exercises in 16 categories**. Each exercise page shows an animation (or
  a placeholder), the title, a one-line summary, *How to do it* and *How much*.
  The site has every exercise physiosolution.com lists, and its 16 category
  pages link only to those same exercises.
- **Animations: 16 of 148 exercises**, all licensed:
  - 13 CDC *Strength training for older adults* GIFs (public domain)
  - 3 Everkinetic drawing pairs (CC BY-SA 3.0) combined into looping GIFs:
    glute bridge, ankle circles and cervical isometric. These show a small
    credit line because the licence requires one.
- `npm run build` passes.

## Owner decisions — don't undo

- Use licensed or royalty-free media only. No random GIFs from the web.
- The exercise page stays minimal so it fits one phone screen. "What it does",
  "Common mistakes", the stop-and-check warnings and FAQs were removed and must
  not come back.
- No footer: the disclaimer, copyright and attribution were removed. The CC
  BY-SA credit under an animation is the one exception, because the licence
  requires it.
- Work on a branch and land it via a PR. Merge to `main` only when the owner
  says so.

## In progress: animations for the other 132 exercises

**What was done.** We built a list of exercise-related media from Wikimedia
Commons and matched it against every exercise name:
- `scripts/commons/pool.mjs` ran 37 of its 38 bulk searches and saved
  `scripts/commons/data/pool.json`, about 8,000 file titles. The `"Setu Bandha"`
  search was still waiting on rate limits when we stopped; running `pool.mjs`
  again picks it up. The searches
  covered:
  - Everkinetic and the CDC set
  - exercise and stretching GIFs, videos and drawings
  - physiotherapy, pilates, Kegel and breathing media
  - Cancer Research UK diagrams
  - yoga asanas
- `scripts/commons/match.mjs` matches each exercise's name plus the synonyms
  in `synonyms.json` against those titles. It writes
  **[`docs/commons-candidates.md`](docs/commons-candidates.md)**, which lists
  all 148 exercises with their status and best matches.

**Result: Commons has little physio-specific animation.**

| Status | Exercises |
| --- | --- |
| ✅ In use | 16 |
| 🔎 Candidates to check by eye | 37 |
| ❌ Checked, no usable match | 5 |
| No name match on Commons | 90 |

Exercises with no match include:
- chin tucks
- dead bug
- clamshell
- tummy time
- most neuro and paediatric exercises

What each source turned out to contain:

| Source | Licence | What it has | Status |
| --- | --- | --- | --- |
| CDC strength training (22 GIFs) | Public domain | Older-adult strength moves | **Used up:** 13 in use, the other 9 checked and don't match our steps |
| Everkinetic (~1,090 drawings, start/end pairs) | CC BY-SA 3.0 | Mostly gym and machine moves | Physio-relevant pairs still to check: static neck side flexion, neck flexion/extension, balance board, hip adduction, internal cable rotation, side plank, front/lateral raises, leg lift |
| Cancer Research UK diagrams | CC BY-SA 4.0 | Shoulder rehab after breast surgery; breathing | Still to check: *walk your fingers up the wall* (→ Wall Walks), *arm up your back* (→ internal-rotation stretch), shoulder and chest stretches, *abdominal breathing* (→ Diaphragmatic Breathing), *controlled breathing* (→ Deep Breathing / Pursed Lip) |
| Yoga photos (*Yoga at Your Park* and others) | Various CC | Asanas | Still to check: Bidalasana + Bitilasana pair (→ Cat-Cow), Balasana (→ Child's Pose), Pavanamuktasana (→ Knee to Chest), cobra (→ McKenzie Extension) |
| One-off drawings | Various | `Birddog exercise.svg`, `Bridge exercise.svg`, `Isometric exercise.svg`, `Kegel Excercise.svg`, `Tree standing onefoot.svg` | Still to check |
| Videos | Various CC | Iliopsoas (hip-flexor) stretch video; a gym "exercise demonstration video" series | Still to check |

`scripts/commons/data/verdicts.json` records what has been checked and
rejected, and why. The matcher shows those notes in the list.

## Next steps

1. **Fetch licences:** run `node scripts/commons/info.mjs`, then
   `node scripts/commons/match.mjs`. This fills in the licence and media type
   for each candidate in the list.
2. **Check each 🔎 candidate by eye** against that exercise's steps in
   `src/data/exercises.json`. Record every outcome in `verdicts.json`, rejected
   ones with a note saying why. Only accept a demonstration that shows the same
   movement as our steps.
3. **Make the GIF.** The container has no ffmpeg or SVG renderer, but
   Wikimedia renders thumbnails:
   - SVG → PNG: `https://upload.wikimedia.org/wikipedia/commons/thumb/<a>/<ab>/<File>.svg/500px-<File>.svg.png`
   - Video still at a timestamp: `…/thumb/<a>/<ab>/<File>.webm/400px-seek=<s>-<File>.webm.jpg`
   - Use standard widths (250/330/500px), or uploads return 429.
   - Combine the frames with Pillow: white background, ≤400px, 32-colour
     palette, ~1000ms per frame, looping. Save as `public/gifs/<slug>.gif`.
4. **Wire it up.** Set `image: "/gifs/<slug>.gif"` and an exact `imageCredit`
   (`author`, `license`, `source` = the Commons file page). Use
   `"<Author> (adapted)"` when frames were combined. The credit line appears
   automatically for any non-public-domain licence.
5. Re-run `match.mjs`, run `npm run build`, open a PR.

## Gotchas

- **Rate limits:** from this cloud environment the Commons API allows only
  ~3–4 requests a minute. The scripts throttle, honour `Retry-After` and resume
  where they stopped, so long runs belong in the background.
- **User-Agent:** send the repo URL only. Never put a personal email in it.
- A name match is not a match. Many hits are false positives: gym machines,
  animals, physics animations. Add obvious noise to `_exclude` in
  `verdicts.json`.

## Open questions for the owner

1. **One-screen fit.** Pages with an animation are ~945–980px tall against
   ~844px on a modern phone. Options: shrink the animation panel, or drop the
   summary line.
2. **CC BY-SA credit lines.** OK to keep the small "Animation: …" credit, or
   replace those 3 animations with placeholders?
3. **The ~100 exercises with nothing on Commons.** Options:
   - the clinic films short clips (best match, owned outright)
   - commission matching line-art animations
   - the GIPHY API, which needs an API key and "Powered by GIPHY", and whose
     accuracy for physio moves varies
   - keep the placeholders
