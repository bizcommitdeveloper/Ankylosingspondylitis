# Ankylosing Spondylitis

A web app to track **Ankylosing Spondylitis** over time. It captures the two
standard patient-reported instruments and charts how they move:

- **BASDAI** — Bath Ankylosing Spondylitis Disease Activity Index (6 questions).
- **BASFI** — Bath Ankylosing Spondylitis Functional Index (10 questions).

Each questionnaire is filled in with 0–10 sliders, scored automatically, saved
to your account, and plotted on a trend chart so you can spot patterns and share
them with a clinician.

> This tool records and visualises your own entries. It is **not** a diagnostic
> tool and does not provide medical advice.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (calm, clinical, light/dark)
- **Firebase** — Authentication (Google + email/password) and Cloud Firestore
- **Recharts** for the trend charts
- Deploys to **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase config
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve the
build), `npm run lint`.

## Firebase setup

1. Create a Firebase project and add a **Web app** to it.
2. In **Authentication → Sign-in method**, enable **Google** and
   **Email/Password**.
3. In **Firestore Database**, create a database and publish the rules from
   [`firestore.rules`](./firestore.rules) (each user can only read/write their
   own data under `users/{uid}`).
4. Copy the web SDK config values into `.env.local` (see
   [`.env.example`](./.env.example)).

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Add the same `NEXT_PUBLIC_FIREBASE_*` variables under **Project → Settings →
   Environment Variables**.
3. In Firebase **Authentication → Settings → Authorized domains**, add your
   Vercel domain so sign-in works in production.

## Data model

Entries are stored per user at `users/{uid}/entries/{entryId}`:

| Field           | Type       | Notes                                   |
| --------------- | ---------- | --------------------------------------- |
| `type`          | string     | `"basdai"` or `"basfi"`                 |
| `answers`       | number[]   | one 0–10 value per question             |
| `score`         | number     | computed index score, 0–10             |
| `note`          | string     | optional free text                      |
| `referenceDate` | string     | `yyyy-mm-dd` the assessment refers to   |
| `createdAt`     | timestamp  | server-assigned                         |

## Privacy

Health data is personal. Entries are scoped to the signed-in user by Firestore
security rules; nothing is shared with third parties. Never commit real Firebase
credentials — keep them in gitignored `.env*.local` files and in Vercel's
environment settings.
