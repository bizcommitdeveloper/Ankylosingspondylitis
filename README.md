# Ankylosing Spondylitis

A **mobile app** (iOS + Android) to track **Ankylosing Spondylitis** over time.
It captures the two standard patient-reported instruments and charts how they
move:

- **BASDAI** — Bath Ankylosing Spondylitis Disease Activity Index (6 questions).
- **BASFI** — Bath Ankylosing Spondylitis Functional Index (10 questions).

Each questionnaire is filled in with 0–10 sliders, scored automatically, saved
to your account, and plotted on a trend chart.

> This tool records and visualises your own entries. It is **not** a diagnostic
> tool and does not provide medical advice.

## Tech stack

- **Expo** (React Native) + **TypeScript**
- **expo-router** for navigation (file-based)
- **Firebase** — Authentication (Google Sign-In) and Cloud Firestore
- **react-native-svg** for the trend chart, **@react-native-community/slider**
  for the 0–10 inputs
- Distributed via the **Apple App Store** and **Google Play** (built with EAS)

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in your Firebase config
npx expo start                 # open in Expo Go, or press i / a for a simulator
```

Useful scripts: `npm run ios`, `npm run android`, `npm run web`,
`npm run typecheck`, `npm run lint`.

## Firebase setup

1. Create a Firebase project and add a **Web app** (the JS SDK is used inside
   React Native). Copy the config values into `.env.local` as the
   `EXPO_PUBLIC_FIREBASE_*` variables (see [`.env.example`](./.env.example)).
2. **Authentication → Sign-in method:** enable **Google** (the only sign-in
   method — see the setup step below).
3. **Firestore Database:** create a database and publish the rules from
   [`firestore.rules`](./firestore.rules) — each user can only read/write their
   own data under `users/{uid}`. From the CLI:
   `firebase deploy --only firestore:rules` (set your project id in
   [`.firebaserc`](./.firebaserc) first).

### Google Sign-In (required)

Google is the only sign-in method. Mobile Google sign-in uses `expo-auth-session`,
not the web popup flow. Create OAuth client IDs (Google Cloud console / Firebase
Auth Google provider) and set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` plus the
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.
Register the app's redirect (the `astracker` scheme in `app.json`) with each
client. Until these are set, the sign-in screen shows a short "not configured"
notice instead of a dead button.

## Building for the App Store & Google Play

This is an Expo app, so use **EAS Build**. Build profiles live in
[`eas.json`](./eas.json): `preview` (installable **APK** / internal iOS build,
great for phone testing) and `production` (store-ready **AAB** / App Store).

```bash
npm i -g eas-cli
eas login                              # your Expo account (run this yourself)

# Set the EXPO_PUBLIC_* config for cloud builds (they aren't read from
# .env.local, which is gitignored and never uploaded):
eas env:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "…"   # repeat per var

eas build --profile preview --platform android   # → downloadable APK
eas build --profile preview --platform ios       # → iOS build (needs Apple acct)
eas submit --profile production --platform ios    # upload to App Store Connect
```

- **Android testing is free:** the `preview` APK installs on any Android phone,
  Google sign-in included.
- **iOS on a physical iPhone** needs the **Apple Developer Program ($99/yr)**
  (TestFlight or ad-hoc); **Google Play** is a one-time $25 registration.
- Both stores ask for a data-safety / privacy declaration — this app stores
  personal health entries per user in your Firestore project and shares nothing
  with third parties.

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
security rules; nothing is shared with third parties. The `EXPO_PUBLIC_FIREBASE_*`
values are public project identifiers (not secrets); keep any genuine secrets out
of the repo and out of the bundle.
