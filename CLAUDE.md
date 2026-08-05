# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project overview

**Ankylosing Spondylitis** is a web app for tracking Ankylosing Spondylitis
(AS) — a form of inflammatory arthritis affecting the spine and sacroiliac
joints. A person living with AS can record the two standard patient-reported
instruments over time, see them scored automatically, and watch the trend:

- **BASDAI** — Bath AS Disease Activity Index (6 questions, 0–10 each).
- **BASFI** — Bath AS Functional Index (10 questions, 0–10 each).

Each questionnaire uses 0–10 sliders, is auto-scored on submit, saved to the
signed-in user's Firestore data, and plotted on a trend dashboard.

## Tech stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 14 (App Router)                            |
| Language   | TypeScript (strict)                                |
| UI         | React 18 + Tailwind CSS (light/dark, `darkMode: media`) |
| Auth       | Firebase Authentication (Google + email/password)  |
| Database   | Cloud Firestore                                    |
| Charts     | Recharts                                           |
| Hosting    | Firebase App Hosting (Next.js SSR on Cloud Run)    |

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:3000
npm run build     # production build (also type-checks and lints)
npm run start     # serve the production build
npm run lint      # ESLint (next/core-web-vitals)
```

There is no separate test runner yet. `npm run build` is the current gate — it
type-checks and lints the whole app; keep it green.

## Project structure

```
src/
  app/                    # Next.js App Router
    layout.tsx            # root layout: AuthProvider + NavBar
    page.tsx              # dashboard (latest scores + trend)
    login/page.tsx        # Google + email/password sign-in
    basdai/page.tsx       # BASDAI questionnaire
    basfi/page.tsx        # BASFI questionnaire
    history/page.tsx      # full history: trend chart + table
    globals.css           # Tailwind layers + base styles
  components/
    AuthProvider.tsx      # auth context (useAuth); wraps the app
    AuthGate.tsx          # redirects unauthenticated users to /login
    NavBar.tsx            # top navigation
    QuestionnaireForm.tsx # reusable BASDAI/BASFI form + live scoring
    ScaleSlider.tsx       # one 0–10 slider question
    TrendChart.tsx        # Recharts line chart (BASDAI + BASFI)
    useEntries.ts         # hook: load the user's entries
  lib/
    firebase.ts           # lazy Firebase init (SSR-safe), isFirebaseConfigured()
    firestore.ts          # saveEntry / getEntries (users/{uid}/entries)
    scoring.ts            # basdaiScore, basfiScore, severity bands
    questions.ts          # BASDAI/BASFI question definitions (slider config)
    types.ts              # Entry / NewEntry / InstrumentType
firestore.rules           # per-user security rules
apphosting.yaml           # Firebase App Hosting: run config + NEXT_PUBLIC_* env
firebase.json             # Firebase CLI config (Firestore rules deploy)
.firebaserc               # default Firebase project id (placeholder)
.env.example              # required NEXT_PUBLIC_FIREBASE_* variables (local dev)
```

## Key conventions

- **Firebase is initialised lazily** (`getFirebaseAuth()`, `getDb()` in
  `lib/firebase.ts`) so modules are safe to import during the server build. Do
  not call `getAuth`/`getFirestore` at module top level.
- **Client components** (`"use client"`) own all Firebase interaction. Anything
  that touches auth or Firestore runs in the browser.
- **Scores are 0–10.** BASDAI = `(Q1+Q2+Q3+Q4 + (Q5+Q6)/2) / 5`; BASFI = mean
  of the 10 answers. Scoring lives only in `lib/scoring.ts` — reuse it, don't
  reinvent it. BASDAI Q6 (stiffness duration) stores the 0–10 mapped value
  (0h→0, ½h→2.5, 1h→5, 1½h→7.5, 2h→10), configured in `lib/questions.ts`.
- **Adding a question or instrument** is a data change in `lib/questions.ts`
  (plus scoring if it's a new instrument); the form and slider render from that
  config.
- **TypeScript-first:** `strict` is on; avoid `any` where a real type is
  practical. `@/*` maps to `src/*`.
- **Match surrounding code:** follow the existing Tailwind/utility patterns and
  the `brand` colour scale in `tailwind.config.ts`.
- **Keep this file current:** when you add tooling, scripts, routes, or
  architectural decisions, update this map.

## Environment / secrets

- Firebase config is read from `NEXT_PUBLIC_FIREBASE_*` env vars (see
  `.env.example`). These identify the project and ship to the browser; access is
  protected by `firestore.rules`, not by hiding them.
- `.env`, `.env*.local`, and `*.pem` are gitignored — **never commit secrets or
  real credentials.** For deployment the same `NEXT_PUBLIC_*` values live in
  `apphosting.yaml` (they're public project identifiers, not secrets); anything
  genuinely secret belongs in Cloud Secret Manager, referenced from
  `apphosting.yaml`, not committed.

## Development workflow

- Work on the designated feature branch (currently
  **`claude/claude-md-docs-evr1lw`**), created from the latest `main`.
- **Never** push directly to `main`.
- Push with `git push -u origin <branch-name>`; retry with exponential backoff
  on network errors.
- After pushing, open a **draft** PR if none is open for the branch. If the
  branch's PR is already merged, restart from the latest `main` and open a new
  PR — don't stack new commits on merged history.

## Domain notes (Ankylosing Spondylitis)

- **Sensitive data.** Symptom logs are personal medical data. Keep the
  privacy-preserving default (entries scoped to the signed-in user), be
  deliberate about storage/transmission, and don't send health data to third
  parties without a clear reason.
- **Instruments.** BASDAI (disease activity) and BASFI (functional index) are
  the validated scores this app implements. Common AS signals more generally:
  pain and its location (spine, sacroiliac, peripheral joints), morning
  stiffness duration, fatigue, flares, medication adherence (NSAIDs, biologics),
  exercise/physical therapy, sleep, and mood.
- **Not medical advice.** The app records and visualises user-entered data; it
  must not present itself as a diagnostic tool or give clinical advice. The
  severity bands in `lib/scoring.ts` are informational only.

## Quick reference

| Item | Value |
| --- | --- |
| Purpose | Track AS disease activity (BASDAI) and function (BASFI) over time |
| Stack | Next.js 14 + TypeScript + Tailwind + Firebase + Recharts |
| App code present? | Yes |
| Build gate | `npm run build` (type-check + lint) |
| Hosting | Firebase App Hosting (`apphosting.yaml`) |
| Working branch | `claude/claude-md-docs-evr1lw` |
| Protected branch | `main` (never push directly) |
| Secrets | `NEXT_PUBLIC_FIREBASE_*` in `.env*.local` (local) / `apphosting.yaml` (deploy) |
