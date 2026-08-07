# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project overview

**Ankylosing Spondylitis** is a **mobile app** (iOS + Android) for tracking
Ankylosing Spondylitis (AS) — a form of inflammatory arthritis affecting the
spine and sacroiliac joints. A person living with AS can record the two standard
patient-reported instruments over time, see them scored automatically, and watch
the trend:

- **BASDAI** — Bath AS Disease Activity Index (6 questions, 0–10 each).
- **BASFI** — Bath AS Functional Index (10 questions, 0–10 each).

Each questionnaire uses 0–10 sliders, is auto-scored on save, stored to the
signed-in user's Firestore data, and plotted on a trend chart.

## Tech stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Expo (React Native), SDK 57 — runs on iOS, Android, web |
| Language    | TypeScript (strict)                                 |
| Navigation  | expo-router (file-based, `app/`)                    |
| Auth        | Firebase Authentication (email/password + Google)   |
| Database    | Cloud Firestore                                     |
| Web         | react-native-web (`expo export -p web` → deploy anywhere) |
| Charts      | react-native-svg (hand-rolled line chart)           |
| Sliders     | @react-native-community/slider                      |
| Icons       | @expo/vector-icons (Ionicons)                       |
| Distribution| Apple App Store + Google Play, built with EAS       |

## Commands

```bash
npm install            # install dependencies
npx expo start         # dev server (Expo Go / simulators)
npm run ios            # open iOS simulator
npm run android        # open Android emulator
npm run web            # run in a browser (react-native-web)
npm run typecheck      # tsc --noEmit (the current gate)
npm run lint           # expo lint
npx expo export -p ios # bundle check (validates Metro resolution)
npx expo export -p web # web build → dist/ (deployable to Firebase Hosting)
```

There is no unit-test runner yet. Keep `npm run typecheck` green; an
`npx expo export` is the strongest local "does it bundle" check.

## Project structure

```
app/                    # expo-router screens (file-based routes)
  _layout.tsx           # root Stack + AuthProvider + theme + StatusBar
  index.tsx             # dashboard (members); redirects signed-out users to /welcome
  welcome.tsx           # public onboarding / landing
  login.tsx             # email/password + Google (gated) sign-in
  learn.tsx             # AS overview + instrument reference
  basdai.tsx            # BASDAI questionnaire (thin wrapper)
  basfi.tsx             # BASFI questionnaire (thin wrapper)
  history.tsx           # trend chart + entries list
components/
  AuthProvider.tsx      # auth context (useAuth)
  GoogleSignInButton.tsx# Google auth hook, mounted only when Google is configured
  QuestionnaireForm.tsx # reusable BASDAI/BASFI form + live scoring + info panel
  ScaleSlider.tsx       # one 0–10 slider question
  TrendChart.tsx        # react-native-svg line chart (BASDAI + BASFI)
  ui.tsx                # Card / Button / Badge atoms
  useEntries.ts         # hook: load the user's entries
lib/
  firebase.ts           # lazy Firebase init, isFirebaseConfigured()
  authPersistence.ts    # native: initializeAuth + AsyncStorage persistence
  authPersistence.web.ts# web: getAuth (browser persistence); Metro picks per platform
  firestore.ts          # saveEntry / getEntries (users/{uid}/entries)
  scoring.ts            # basdaiScore, basfiScore, severity() → tone bands
  questions.ts          # BASDAI/BASFI question definitions (slider config)
  content.ts            # patient-facing educational copy + sources (single source)
  theme.ts              # useTheme() light/dark colour tokens
  types.ts              # Entry / NewEntry / InstrumentType
app.json                # Expo config (scheme, plugins, bundle ids)
firestore.rules         # per-user security rules
firebase.json/.firebaserc # Firebase CLI config (Firestore rules deploy)
.env.example            # EXPO_PUBLIC_FIREBASE_* + optional Google client IDs
```

## Key conventions

- **Firebase is initialised lazily** (`getFirebaseApp()`, `getFirebaseAuth()`,
  `getDb()` in `lib/firebase.ts`). Auth persistence is **platform-split**:
  `authPersistence.ts` (native) uses `initializeAuth` +
  `getReactNativePersistence(AsyncStorage)`; `authPersistence.web.ts` uses
  `getAuth` (browser persistence). Metro loads the right one per platform, so the
  RN-only helper (and its `declare module` type shim) never enters the web bundle.
- **Auth methods:** email/password (works everywhere with no extra setup) plus
  optional **Google**. The Google `useIdTokenAuthRequest` hook lives inside
  `GoogleSignInButton`, which is mounted **only when
  `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set** — on web that hook throws without a
  client ID, so it must not run when Google is unconfigured.
- **Env vars are `EXPO_PUBLIC_*`** (embedded in the bundle; public identifiers,
  not secrets). Config presence is checked by `isFirebaseConfigured()`.
- **Scores are 0–10.** BASDAI = `(Q1+Q2+Q3+Q4 + (Q5+Q6)/2) / 5`; BASFI = mean of
  the 10 answers. Scoring lives only in `lib/scoring.ts`. BASDAI Q6 (stiffness
  duration) stores the 0–10 mapped value (0h→0 … 2h→10), configured in
  `lib/questions.ts`.
- **`severity()` returns a semantic `tone`** (`calm`/`moderate`/`high`), not
  colours; `lib/theme.ts` maps tones to colours so light/dark stay consistent.
- **Styling** is React Native `StyleSheet`/inline styles driven by `useTheme()`
  — there is no Tailwind. Match the existing atoms in `components/ui.tsx`.
- **Adding a question or instrument** is a data change in `lib/questions.ts`
  (plus scoring for a new instrument); the form renders from that config.
- **TypeScript-first:** `strict` is on; tsconfig extends `expo/tsconfig.base`
  (which sets `customConditions: ["react-native"]`). `@/*` maps to the repo root,
  but screens use relative imports.
- **Keep this file current:** when you add tooling, screens, or architectural
  decisions, update this map.

## Environment / secrets

- Firebase config is read from `EXPO_PUBLIC_FIREBASE_*` env vars (see
  `.env.example`). Copy it to `.env.local` for local dev.
- `.env`, `.env*.local`, and `*.pem`/keystores are gitignored — **never commit
  secrets or signing credentials.** Store/signing credentials belong in EAS, not
  the repo.

## Development workflow

- Work on the designated feature branch (currently
  **`claude/claude-md-docs-evr1lw`**), created from the latest `main`.
- **Never** push directly to `main`; land changes by merging a PR.
- Push with `git push -u origin <branch-name>`; retry with exponential backoff
  on network errors.
- After pushing, open a **draft** PR if none is open for the branch. If the
  branch's PR is already merged, restart from the latest `main` (same branch
  name) and open a new PR — don't stack new commits on merged history.

## Building & releasing

- Use **EAS Build** (`eas build -p ios|android`) and **EAS Submit** to ship to
  the App Store / Google Play. `app.json` holds the bundle identifiers
  (`com.astracker.app`) and the `astracker` deep-link scheme (needed for Google
  auth redirects).

## Developing & testing from mobile (no Mac)

This project is developed entirely from a phone: Claude Code (web) edits and
builds in a cloud sandbox and pushes to GitHub — no local Mac or Xcode is needed
for coding. Testing without a Mac:

- **Expo Go (fastest iteration).** Install Expo Go on the phone, run
  `npx expo start --tunnel` in the session, open the link. Great for UI and
  logic. Google sign-in via `expo-auth-session` needs the web client ID / Expo
  proxy to behave inside Expo Go.
- **EAS Build (cloud, the real app).** `eas build` compiles on Expo's servers.
  - **Android:** build a `preview` APK, download and install on any Android
    phone — free, and Google sign-in works in this dev build.
  - **iOS:** installing on a physical iPhone needs a paid **Apple Developer**
    account ($99/yr) via TestFlight or ad-hoc internal distribution. No Mac is
    required, but the paid account is.
- **Simulators/emulators** (`npm run ios` / `npm run android`) require a
  Mac / Android Studio — not part of the phone-only flow.

`eas login && eas build` must be run by the project owner (it needs their Expo
account); Claude cannot log in on their behalf. Optional `eas.json` build
profiles can be added to standardise the Android-APK and iOS builds.

## Domain notes (Ankylosing Spondylitis)

- **Sensitive data.** Symptom logs are personal medical data. Keep the
  privacy-preserving default (entries scoped to the signed-in user), be
  deliberate about storage/transmission, and don't send health data to third
  parties without a clear reason.
- **Instruments.** BASDAI (disease activity) and BASFI (functional index) are
  the validated scores this app implements. Common AS signals more generally:
  pain and its location (spine, sacroiliac, peripheral joints), morning
  stiffness duration, fatigue, flares, medication adherence, exercise, sleep.
- **Not medical advice.** The app records and visualises user-entered data; it
  must not present itself as a diagnostic tool or give clinical advice. The
  severity bands in `lib/scoring.ts` are informational only.

## Quick reference

| Item | Value |
| --- | --- |
| Purpose | Track AS disease activity (BASDAI) and function (BASFI) over time |
| Stack | Expo (React Native) + TypeScript + Firebase |
| App code present? | Yes |
| Build gate | `npm run typecheck` (+ `npx expo export` to check bundling) |
| Distribution | App Store + Google Play via EAS |
| Working branch | `claude/claude-md-docs-evr1lw` |
| Protected branch | `main` (never push directly) |
| Secrets | `EXPO_PUBLIC_*` in `.env*.local` (local); signing creds in EAS |
