# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project overview

**Ankylosingspondylitis** is an application for tracking Ankylosing Spondylitis
(AS) — a form of inflammatory arthritis affecting the spine and sacroiliac
joints. The goal is to let a person living with AS log symptoms, medication,
activity, and other disease markers over time so they can spot trends and share
data with clinicians.

> **Status: greenfield.** As of this writing the repository contains only
> `README.md` and `.gitignore` — there is no application code, `package.json`,
> or build tooling yet. Most of this document therefore describes the *intended*
> setup (inferred from `.gitignore`) plus the conventions to follow as the code
> is written. When you add real structure, **update this file to match reality**
> and remove the "intended / not yet present" caveats.

## Intended tech stack

The committed `.gitignore` is the standard **Create Next App** template — it
ignores `/.next/`, `/out/`, `next-env.d.ts`, `*.tsbuildinfo`, `/.pnp`,
`.pnp.js`, and `.vercel`. That strongly signals the planned foundation:

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Deployment target:** Vercel
- **Package manager:** npm or Yarn (both `npm-debug.log*` and `yarn-*.log`
  are ignored; Yarn PnP entries are present but PnP is not required). Pick one
  and add its lockfile — do not commit both `package-lock.json` and
  `yarn.lock`.

Nothing above is locked in until the corresponding files exist. If the project
is initialized with a different stack, treat the `.gitignore` as the weaker
signal and update this section.

## Bootstrapping the project

If you are asked to scaffold the app, the `.gitignore` already anticipates a
Next.js + TypeScript project. A conventional starting point:

```bash
# From the repo root — scaffold in place, keeping the existing README/.gitignore
npx create-next-app@latest . --typescript --eslint
```

After scaffolding, verify the generated `.gitignore` doesn't conflict with the
committed one (merge, don't blindly overwrite), then confirm the toolchain runs
before committing:

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # linting
```

Once these scripts exist, replace this section with the *actual* commands and
document any project-specific scripts, environment variables, and test runner.

## Development workflow

### Branching

- Do all work on the designated feature branch — currently
  **`claude/claude-md-docs-evr1lw`** — created from the latest `main`.
- **Never** push directly to `main`.
- Keep commits focused with clear, descriptive messages.

### Git push and PRs

- Push with `git push -u origin <branch-name>`.
- On network failures, retry with exponential backoff (2s, 4s, 8s, 16s).
- After pushing, open a **draft** pull request for the branch if no open PR
  already exists for it.
- If a PR for the branch has already been merged, treat new work as a fresh
  change: restart the branch from the latest `main`, then push and open a new
  PR — do not stack new commits on already-merged history.

### Environment / secrets

- All `.env`, `.env*.local` files are gitignored — **never commit secrets**.
- `*.pem` files are ignored; keep keys and certificates out of the repo.

## Conventions

- **TypeScript-first:** prefer typed code and avoid `any` where a real type is
  practical.
- **Match surrounding code:** once a codebase exists, follow its existing
  naming, formatting, and structural idioms rather than introducing new ones.
- **Keep this file current:** whenever you add tooling, scripts, directories, or
  architectural decisions, reflect them here so the next assistant has an
  accurate map.

## Domain notes (Ankylosing Spondylitis)

This is a **health-tracking** application, so a few domain considerations should
shape design decisions:

- **Sensitive data.** Symptom, medication, and health logs are personal medical
  data. Favor privacy-preserving defaults, be deliberate about where data is
  stored and transmitted, and avoid sending health data to third parties without
  a clear reason.
- **Common tracked signals for AS** (useful when modeling data): pain level and
  location (spine, sacroiliac, peripheral joints), morning stiffness duration,
  fatigue, flare occurrences, medication adherence (e.g. NSAIDs, biologics),
  exercise/physical therapy, sleep quality, and mood. Validated instruments such
  as **BASDAI** (disease activity) and **BASFI** (functional index) are the kind
  of standardized scores this app may want to support.
- **Not medical advice.** The app records and visualizes user-entered data; it
  should not present itself as a diagnostic tool or give clinical advice.

## Quick reference

| Item | Value |
| --- | --- |
| Purpose | Track Ankylosing Spondylitis symptoms over time |
| Intended stack | Next.js + TypeScript (inferred from `.gitignore`) |
| App code present? | Not yet — greenfield |
| Working branch | `claude/claude-md-docs-evr1lw` |
| Protected branch | `main` (never push directly) |
| Secrets | Keep in gitignored `.env*` files only |
