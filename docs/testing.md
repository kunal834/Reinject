# Testing guide

How this project is tested, which tool does what, and when to write which kind of test.

## The three layers

| Layer | What it tests | Tool | Needs a running server? | Speed |
| :--- | :--- | :--- | :--- | :--- |
| **Unit** | One pure function in isolation (no DB, no HTTP) | Vitest | No | ~ms |
| **Integration** | Several pieces together: Hono app + middleware + handlers + **real D1** | Vitest + `@cloudflare/vitest-pool-workers` | No | ~10–100 ms |
| **E2E** | The whole running system from outside, over real HTTP | Hurl | Yes (`wrangler dev` or a deployed URL) | ~seconds |

> **Vitest is a test runner, not a test type.** It runs both unit and integration tests. What makes a test "unit" or "integration" is *what it touches*, not the tool.

### How much of each

This app is mostly "validate → read/write D1 → return JSON", so most of the value is in **integration** tests:

- **A few unit tests** — Zod schemas, pure helpers (formatting, hashing helpers)
- **Many integration tests** — every route and every `db/` function, happy path *and* failure paths
- **A handful of E2E tests** — critical user flows + post-deploy smoke checks

---

## Tools

### Vitest (`vitest@^4.1`)
The test runner. Jest-compatible API (`describe`, `it`, `expect`), native TypeScript/ESM, fast watch mode.

**Pinned to v4** — `@cloudflare/vitest-pool-workers@0.22` only supports Vitest `^4.1`. Don't upgrade Vitest to v5 until the pool supports it (check its `peerDependencies` on npm).

### `@cloudflare/vitest-pool-workers`
Cloudflare's official Vitest integration. Tests run **inside `workerd`** (the real Workers runtime), not Node. This means:

- `env.DB` is a **real D1 (SQLite)** — local and in-memory, never your remote database
- Your `migrations/` are applied automatically before tests, so the test DB schema = production schema
- Later: you can call queue consumers directly with fake message batches (`createMessageBatch`) to test retries and idempotency

Why not Jest / Node test runner? They run in Node, so you'd have to **mock D1**. Mocks hide the bugs you most want to catch (wrong SQL, missing column, broken migration).

### Hurl
Plain-text HTTP request files with assertions. Black-box: it only sees HTTP, like a real client.

Best for: E2E flows across multiple requests (cookies, captured IDs), and **smoke tests against a deployed URL** — just swap the env file.

Not for: anything without an HTTP endpoint (queue consumers, cron jobs), checking DB state, testing internals.

---

## Folder layout

```text
api/
├── vitest.config.ts              # Vitest + Workers pool config, test bindings
└── tests/
    ├── env.d.ts                  # types for test-only bindings (TEST_MIGRATIONS)
    ├── tsconfig.json             # adds `cloudflare:test` types for test files
    ├── setup/
    │   └── apply-migrations.ts   # applies migrations/ to the test D1
    ├── unit/                     # Vitest — pure functions
    │   └── validator.test.ts
    ├── integration/              # Vitest — app + real D1
    │   └── auth.test.ts
    └── hurl/                     # Hurl — E2E against a running server
        ├── auth_flow.hurl
        ├── survey_flow.hurl
        └── env/local.env
```

## Running tests

All commands from `api/`:

```bash
pnpm test                 # all Vitest tests (unit + integration), once
pnpm test:watch           # Vitest in watch mode — reruns on save
pnpm test:unit            # unit only
pnpm test:integration     # integration only

# E2E — start the server first in another terminal:
pnpm dev
pnpm test:e2e             # runs auth_flow + survey_flow with Hurl
```

E2E needs the [Hurl CLI](https://hurl.dev) installed on your machine (it's a binary, not an npm package).

---

## How Vitest was installed and connected (full workflow)

This is exactly what was done to set up Vitest in this repo, in order, with the reason for each step. Use it as a checklist when you set up Vitest on another Workers project.

### Big picture

```text
                 ┌──────────────── Node.js (your machine) ────────────────┐
 pnpm test ───►  │ vitest  ──loads──► vitest.config.ts                    │
                 │                     ├─ readD1Migrations('migrations/') │
                 │                     └─ cloudflareTest({ wrangler, miniflare.bindings })
                 └──────────────────────────────┬─────────────────────────┘
                                                │ starts
                 ┌──────────────── workerd (Workers runtime) ──────────────┐
                 │ bindings: DB (local D1), JWT_SECRET, TEST_MIGRATIONS    │
                 │ 1. tests/setup/apply-migrations.ts → creates tables     │
                 │ 2. tests/**/*.test.ts → app.request(path, init, env)    │
                 │                          └─► Hono app → handlers → D1   │
                 └─────────────────────────────────────────────────────────┘
```

The key idea: **Vitest itself runs in Node, but your test code runs inside `workerd`**, the same runtime as production. The config file is the bridge between the two.

### Step 0: Check version compatibility *before* installing

The Workers pool only supports specific Vitest versions, so check that first:

```bash
npm view @cloudflare/vitest-pool-workers version peerDependencies
# version: 0.22.0
# peerDependencies: { vitest: '^4.1.0', '@vitest/runner': '^4.1.0', '@vitest/snapshot': '^4.1.0' }

npm view vitest version
# 5.0.3   ← newest Vitest is NOT supported by the pool
```

**Lesson:** never blindly install `latest` of two packages that depend on each other. Read `peerDependencies`. Installing Vitest 5 here would have failed at startup with a version error.

### Step 1: Fix the broken install (problem found on the way)

The first `pnpm add` failed:

```text
ERR_PNPM_UNEXPECTED_VIRTUAL_STORE
The dependencies at "E:\Kunal\ReInject\node_modules" are currently symlinked from
the virtual store directory at "E:\Kunal\sde-intern-task\node_modules\.pnpm"
```

**Cause:** the project folder had been renamed from `sde-intern-task` to `ReInject`. pnpm's `node_modules` uses symlinks into a store, and those links still pointed at the old (deleted) folder.

**Fix:** reinstall from the workspace root:

```bash
cd E:/Kunal/ReInject
pnpm install
```

Two more problems showed up during the reinstall:

| Error | Cause | Fix |
| :--- | :--- | :--- |
| `EBUSY: resource busy or locked ... miniflare` | `wrangler dev` was running and Windows locks files a process has open | Stop `pnpm dev` (Ctrl+C), then retry |
| `ERR_PNPM_OUTDATED_LOCKFILE` | `zod` and `bcryptjs` had been added with **npm** (`api/package-lock.json`), so `pnpm-lock.yaml` didn't know about them | `pnpm install --no-frozen-lockfile` to let pnpm update its lockfile |

**Lesson:** use **one package manager** per repo. This repo is a pnpm workspace, so `api/package-lock.json` should be deleted and every dependency added with `pnpm add`.

### Step 2: Install the packages

From `api/`:

```bash
pnpm add -D vitest@^4.1.0 @vitest/runner@^4.1.0 @vitest/snapshot@^4.1.0 @cloudflare/vitest-pool-workers@^0.22.0
```

| Package | Why |
| :--- | :--- |
| `vitest` | The test runner (`describe`, `it`, `expect`, watch mode) |
| `@vitest/runner`, `@vitest/snapshot` | Peer dependencies the pool requires. With pnpm's strict layout they must be installed explicitly. |
| `@cloudflare/vitest-pool-workers` | Runs tests inside `workerd` and provides the `cloudflare:test` module (`env`, `applyD1Migrations`, `createMessageBatch`, …) |

All of them are `-D` (devDependencies): tests are never shipped to production.

### Step 3: Create `api/vitest.config.ts`

```ts
import path from 'node:path'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'))

  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: {
            JWT_SECRET: 'test-secret',
            TEST_MIGRATIONS: migrations,
          },
        },
      }),
    ],
    test: {
      include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
      setupFiles: ['./tests/setup/apply-migrations.ts'],
    },
  }
})
```

Line by line:

- **`defineConfig(async () => …)`**: the config is async because reading the migration files takes I/O.
- **`readD1Migrations(...)`**: runs in **Node**. It reads `migrations/0001_baseline.sql`, `0002_...`, `0003_...` and splits them into SQL statements. It has to run in Node because code inside `workerd` has no access to your disk.
- **`cloudflareTest({...})`**: the Vitest plugin that switches test execution into `workerd`. (In pool v0.22 / Vitest 4 this is a **plugin**; older guides show `defineWorkersConfig` and `poolOptions.workers`, which is the Vitest 3 API.)
- **`wrangler.configPath`**: reuses your real `wrangler.jsonc`, so tests get the same `DB` binding, `compatibility_date` and `nodejs_compat` flag as production. D1 is created **locally in memory**, so the remote `database_id` is never contacted.
- **`miniflare.bindings`**: extra bindings for tests only:
  - `JWT_SECRET: 'test-secret'` **overrides** the value from `.dev.vars` (verified with a throwaway test asserting `env.JWT_SECRET === 'test-secret'`). Tests should never depend on a developer's local secrets.
  - `TEST_MIGRATIONS`: the only way to get the migration list from Node into the Workers runtime is to pass it as a binding.
- **`include`**: Vitest only picks up `tests/unit` and `tests/integration`. Hurl files are not Vitest tests.
- **`setupFiles`**: runs before **each test file**.

### Step 4: Create the migration setup file

```ts
// api/tests/setup/apply-migrations.ts
import { applyD1Migrations, env } from 'cloudflare:test'

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
```

This runs inside `workerd`. It creates your tables in the test D1 and records them in a `d1_migrations` table, so already-applied migrations are skipped. Because tests use **your real migration files**, a broken migration fails the tests: you get migration testing for free.

### Step 5: Make TypeScript understand the test environment

`cloudflare:test` isn't a real npm path, and `TEST_MIGRATIONS` isn't in your production `Env`. Two files fix that:

```jsonc
// api/tests/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@cloudflare/vitest-pool-workers/types"]   // ← adds the `cloudflare:test` module types
  },
  "include": ["./**/*.ts", "../src/**/*.ts", "../worker-configuration.d.ts"]
}
```

```ts
// api/tests/env.d.ts: adds test-only bindings to the generated `Env` type
declare namespace Cloudflare {
  interface Env {
    TEST_MIGRATIONS: import('@cloudflare/vitest-pool-workers').D1Migration[]
  }
}
```

A separate `tests/tsconfig.json` keeps test-only types (`cloudflare:test`, `TEST_MIGRATIONS`) **out of your production code**. `src/` can't accidentally import test helpers.

Check the test types with:

```bash
pnpm tsc --noEmit -p tests
```

### Step 6: Add npm scripts

In `api/package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:unit": "vitest run tests/unit",
"test:integration": "vitest run tests/integration",
"test:e2e": "pnpm auth_test && pnpm survey_test"
```

`vitest run` runs once and exits (for CI). Plain `vitest` stays in watch mode (for development).

### Step 7: Write the first tests

The tests were written from the simplest layer outward:

1. **Unit:** `tests/unit/validator.test.ts` tests the Zod schemas. This proves Vitest itself works, without the database involved.
2. **Integration:** `tests/integration/auth.test.ts` tests health, signup, `/me`, duplicate signup, wrong password, bad payload and the 401 guard. This proves the pool, D1 and migrations all work together.

How an integration test reaches the app **without a server**:

```ts
import { env } from 'cloudflare:test'     // the bindings: DB, JWT_SECRET, …
import app from '../../src/index'          // the Hono app itself

const res = await app.request('/api/health', {}, env)
//                  ▲ Hono's built-in test helper: builds a Request, runs it
//                    through all middleware + routes, and passes `env` as c.env
```

Two habits that make tests reliable:

- **A unique email per test** (`test-${crypto.randomUUID()}@example.com`), so tests never collide, regardless of order or storage sharing.
- **Reading the session cookie from `Set-Cookie`** and sending it back in the next request, like a browser would.

### Step 8: Verify everything

```bash
pnpm test                              # 13 passed | 1 todo
pnpm tsc --noEmit -p tests             # 0 errors in test files
pnpm biome check --write api/tests api/vitest.config.ts   # format to repo style (from root)
```

Then **re-run the tests after formatting**: never assume a "harmless" change didn't break anything.

Also check that the test environment is what you think it is. That's why the `JWT_SECRET` override was verified with a throwaway test instead of assumed.

### Gotchas to remember

| Gotcha | What to do |
| :--- | :--- |
| Vitest 5 is out, but the pool needs `^4.1` | Check `npm view @cloudflare/vitest-pool-workers peerDependencies` before upgrading |
| Tutorials show `defineWorkersConfig` / `poolOptions.workers` | That's the old Vitest 3 API. With Vitest 4 (this repo: pool 0.22) use the `cloudflareTest()` plugin. |
| `"Using secrets defined in .dev.vars"` in test output | Normal: `.dev.vars` is loaded, then `miniflare.bindings` overrides it |
| `cannot find module 'cloudflare:test'` in the editor | Make sure `tests/tsconfig.json` includes `@cloudflare/vitest-pool-workers/types` |
| A new migration file | Nothing to do. Tests pick it up automatically on the next run. |
| New binding in `wrangler.jsonc` (KV, Queue, …) | Run `pnpm cf-typegen`. Tests get the binding automatically through `configPath`. |
| Windows `EBUSY` during install | Stop `wrangler dev` / `vitest --watch` first |

## Writing tests

### Unit test

```ts
import { describe, expect, it } from 'vitest'
import { signupschema } from '../../src/validators/validator'

it('rejects a short password', () => {
  const result = signupschema.safeParse({ name: 'K', email: 'k@x.com', password: '1' })
  expect(result.success).toBe(false)
})
```

### Integration test

```ts
import { env } from 'cloudflare:test'
import { expect, it } from 'vitest'
import app from '../../src/index'

it('signup creates a user row', async () => {
  const email = `test-${crypto.randomUUID()}@example.com`
  const res = await app.request('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'T', email, password: 'secret123' }),
  }, env)

  expect(res.status).toBe(200)
  // You can assert on the database directly — Hurl can't do this.
  const row = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  expect(row).not.toBeNull()
})
```

### Rules

1. **Every test creates its own data.** Use unique values (`crypto.randomUUID()`) — never depend on another test or on test order.
2. **Test the failure paths, not just the happy path.** Bad input → 400, no cookie → 401, someone else's resource → 403/404.
3. **Assert on the database when it matters** (e.g. password is hashed, row actually deleted).
4. **One behavior per test.** The test name should read like a sentence: *"rejects login with a wrong password"*.
5. **A bug fix starts with a failing test** that reproduces it.

---

## Which layer should this test be in?

```text
Does it need the DB, routing, middleware, or cookies?
├── No  → Unit (Vitest)
└── Yes → Does it need to go over real HTTP to a running/deployed server?
          ├── No  → Integration (Vitest + Workers pool)   ← default choice
          └── Yes → E2E (Hurl)
```

| Scenario | Layer |
| :--- | :--- |
| Zod schema rejects bad email | Unit |
| `POST /api/auth/signup` hashes password | Integration |
| User A can't read User B's survey responses | Integration (+ one Hurl check) |
| Migration adds column correctly | Integration (it runs on every test run) |
| Queue consumer is idempotent | Integration (`createMessageBatch`) |
| Signup → create survey → submit → view responses on prod | E2E (Hurl) |

---

## Known gaps / next tests to write

- [ ] `email` in `signupschema` is `z.string()` — any string passes. Switch to `z.email()` and complete the `it.todo` in `tests/unit/validator.test.ts`.
- [ ] **Authorization:** user A must not see user B's `/api/surveys/:id/responses`. Highest-value missing test.
- [ ] Survey creation + listing (`/api/surveys/build`, `/api/surveys/list`).
- [ ] Public submission: valid answers, invalid payload, nonexistent survey.
- [ ] Hurl: make `auth_flow.hurl` repeatable (unique email per run) and make `survey_flow.hurl` create its own user instead of depending on `auth_flow`.
- [ ] CI: run `pnpm check`, `pnpm typecheck`, `pnpm test` on every push; run Hurl against the deployed URL after deploy.
- [ ] `pnpm typecheck` currently fails with pre-existing errors in `src/handlers/survey.handler.ts` (`loginschema` not imported, `c.get('user')` not typed). Fix before adding typecheck to CI.
