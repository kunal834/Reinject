<p align="center">
  <a href="https://docodego.com/">
    <img src=".github/logo.png" alt="DoCoDeGo — Document · Compose · Demonstrate · Govern — an open framework for teams accountable for what AI produces in their name" width="500" />
  </a>
</p>

# SDE Intern — Branded Survey Builder

Welcome. This is a ~1-week take-home for the SDE intern role at **[DoCoDeGo](https://docodego.com/)** — an open framework for teams accountable for what AI produces in their name.

This assignment exists to test exactly what we care about: can you direct AI tools to ship something real, and then stand behind every line of the result?

## The problem

Build a web app where a signed-in user can:

1. **Create surveys** using a builder UI (add / remove / reorder questions, configure each).
2. **Brand each survey** with their own visual identity (at minimum: primary color + logo).
3. **Share a public URL** that lets anyone — no sign-in required — fill in the survey.
4. **View the responses** in their dashboard.

Think of it as a tiny Typeform / Tally clone.

## What we're evaluating

**Primary: product taste, UX judgement, and your ability to stand behind what was made.**

DoCoDeGo's thesis is that AI-generated work is only useful when a human can own it end-to-end. So we expect you to use Claude, Cursor, Copilot, or whatever AI tools move you fastest — that's not cheating, it's the job. What we're actually looking at is:

- **The decisions you made.** What question types did you pick, and why? How does the builder feel to use? Is the public survey page actually pleasant for a respondent? *Intent is the primary artefact.*
- **Whether you understand what you shipped.** You will record a walkthrough (see Submission). If the video shows you can't explain a choice in your own code, that's the strongest negative signal we have.
- **Where you spent your time.** Did you obsess over the builder UX and ship a basic dashboard, or did you set up a Redux store for three routes and never finish the brand picker? Make tradeoffs and own them.

We are **not** primarily evaluating: number of features, test coverage, theoretical scalability, or how closely your code matches some house style. Ship something you'd be proud to demo.

## Stack (required)

- **Backend:** Hono on Cloudflare Workers
- **Frontend:** React + Vite + TanStack Router (client-side routing only — no SSR framework)
- **Persistence:** Cloudflare D1 / KV / R2 — pick what fits, justify in your walkthrough
- **Language:** TypeScript on both sides

Styling, component library, state management beyond Router, and form library are all your call. Pick tools you can defend.

**Code quality:** [Biome](https://biomejs.dev/) is configured at the root for formatting and linting. `pnpm check` must pass on your submission — we run it as part of review. Fix issues with `pnpm check:fix`. If you genuinely need to disable a rule, do it explicitly in `biome.json` and be ready to defend it.

A minimal starter is provided in `api/` and `web/`. It boots and serves `/api/health` and a home route — that's it. Everything else is yours to design.

## MVP (must have)

- [ ] Sign-in (any approach — magic link, OAuth, even a simple email-only flow if you can justify it)
- [ ] Survey builder with **at least 3 question types** (e.g., short text, multiple choice, 1–5 rating)
- [ ] Add / remove / reorder questions
- [ ] Per-survey branding: primary color + logo (URL is fine; upload is a stretch)
- [ ] Shareable public URL — survey renders in the owner's brand, no login required to respond
- [ ] Anonymous response submission persisted server-side
- [ ] Owner dashboard: list own surveys, view responses (how you present them is up to you)

## Stretch (impressive, not required)

- More question types (long text, single-select, matrix, date)
- Logo upload (R2)
- Font picker / richer theme controls
- Response analytics (counts, averages, per-question breakdowns)
- CSV export
- Deployed to Cloudflare (share the URL!)
- Branching / conditional questions

**Do not chase stretch goals at the cost of MVP polish.** A tight MVP with great UX beats a sprawling half-done feature set every time. We hold to an anti-complexity principle — cut scope cleanly rather than ship sprawl.

## Time

We expect roughly **one week of focused effort**. If you find yourself fighting setup for more than a day, ping us — don't burn the week on tooling.

## AI tool policy

At DoCoDeGo we hold that **autonomy without accountability is catastrophe**. The rules here come from that:

- Use any AI tools you want. Tell us which ones, where, and how in your walkthrough.
- You own every line you submit. We will pick a file at random in the interview and ask you to walk through it line by line. "The AI wrote it" is not an answer.
- **Stand behind what was made.** If you can't justify a decision in your own code, take the time to understand it before submitting — or rewrite it.
- Don't paste our problem statement verbatim into a public model with company-identifying context. Local IDE assistants and standard chat tools are fine.

## How to submit

1. **Use this template.** Click the green **"Use this template" → Create a new repository** button at the top of this repo. Name it whatever you want (e.g. `your-name-survey-builder`). Public or private is your call — if private, add `@mynk-tmr` as a collaborator.
2. **Build the project** in your new repo. Commit normally — granular commits are fine, we'd rather see your work pattern than a single mega-commit at the end.
3. **Record a walkthrough** (5–10 min, Loom or similar). Cover:
   - A live demo of the happy path (create survey → brand it → share URL → respond → view responses).
   - Your three or four most interesting decisions and why you made them.
   - One thing you'd do differently with another week.
   - Which AI tools you used and where they helped vs got in the way.
4. **Email us** the repo URL and the walkthrough link. That's the submission.

We will:
- Clone your repo and run `pnpm install && pnpm check && pnpm typecheck && pnpm dev` ourselves.
- Read the history, lockfile, and scripts.
- Watch your walkthrough.
- Schedule an interview where we'll pick a file at random and ask you to walk through it.

## Running the starter

This is a pnpm workspace. One install at the root covers both `api/` and `web/`.

```bash
pnpm install        # installs api, web, and root devDeps in one pass
pnpm dev            # runs api (:8787) and web (:5173) together, output prefixed [api]/[web]
```

Open http://localhost:5173 — you should see the starter placeholder page pointing back to this README. `/api/health` (proxied through Vite) returns `{ "status": "ok" }`. From there, it's your project.

Other useful scripts (from the root):

```bash
pnpm check          # biome — formatting + linting, must pass on submission
pnpm check:fix      # auto-fix what biome can fix
pnpm typecheck      # tsc --noEmit across both packages
pnpm build          # production build of web
```

When you add Cloudflare bindings (D1, KV, R2, secrets) in `api/wrangler.jsonc`, regenerate `Env` types:

```bash
pnpm --filter sde-intern-task-api cf-typegen
```

> We use pnpm for the workspace setup. If you have a strong preference for npm/yarn, you can convert it — but the lockfile we'll review is `pnpm-lock.yaml`.

Good luck — we're excited to see what you build, and how you stand behind it.

— The DoCoDeGo team
