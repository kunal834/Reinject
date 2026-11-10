my-hono-app/
├── .wrangler/                  # Local D1 state & Wrangler cache (git-ignored)
├── migrations/                 # D1 SQL migration files
│   └── 0000_init.sql           # Initial DB schema creation
├── src/
│   ├── config/                 # Application constants and static configuration
│   │   └── constants.ts
│   ├── db/                     # Data Access Layer (Pure functional queries)
│   │   ├── index.ts            # Central exports for DB helpers
│   │   ├── users.db.ts         # User SQL queries (getUserByEmail, createUser)
│   │   └── posts.db.ts         # Post SQL queries
│   ├── handlers/               # Request/Response HTTP Logic
│   │   ├── auth.handler.ts     # Handlers for authentication routes
│   │   └── user.handler.ts     # Handlers for user management
│   ├── middlewares/            # Scoped Context & Custom Middlewares
│   │   ├── auth.middleware.ts  # JWT validation & context injection
│   │   └── error.middleware.ts # Global error boundary (Zod & D1 exception handling)
│   ├── routes/                 # Hono Routers (Endpoint routing)
│   │   ├── auth.route.ts       # Sub-router for /api/v1/auth
│   │   ├── user.route.ts       # Sub-router for /api/v1/users
│   │   └── index.ts            # Aggregated router root
│   ├── schemas/                # Zod Schemas & Inferred TS Types
│   │   ├── auth.schema.ts      # Auth validation (login, register)
│   │   └── user.schema.ts      # User validation (profile updates)
│   ├── types/                  # Ambient TypeScript Definitions
│   │   └── env.ts              # Custom AppEnv (c.env bindings & c.set variables)
│   ├── utils/                  # Pure utility functions
│   │   └── password.ts         # Password hashing helpers (Web Crypto API)
│   └── index.ts                # App Entrypoint (App instance & middleware mounting)
├── .gitignore
├── package.json
├── tsconfig.json
└── wrangler.json               # Cloudflare Workers & D1 configuration

# Repository Pattern or Data Access Objects (DAO).
we will create of my own database function to talk to drivers direclty to optimize it in handlers function
here also 2 different architectures come into play 

# Comparison: Object-Oriented (Repositories) vs. Functional (DB Helpers) Data Access Patterns

When designing a backend data access layer, developers generally choose between an **Object-Oriented Architecture** (using classes and repositories) and a **Functional Architecture** (using pure database helper functions). 

The optimal choice depends heavily on your runtime environment (Node.js LTS vs. Serverless/Edge Runtime) and framework paradigm (Express vs. Hono).

---

## Overview Comparison

| Feature | Object-Oriented Pattern (`repositories/`) | Functional Pattern (`db/`) |
| :--- | :--- | :--- |
| **Primary Unit** | Classes & Instances (`class UserRepository`) | Pure Functions (`export async function getUserByEmail`) |
| **State Management** | Encapsulated in class instances (`this.db`) | Passed explicitly per execution (`db: D1Database`) |
| **Architectural Fit** | Traditional Node.js servers, Express, NestJS | Serverless Workers, Cloudflare D1, Hono |
| **Bundle Size & Tree-Shaking**| Harder to tree-shake unused class methods | Exceptional tree-shaking support |
| **Cold Start Overhead** | Instantiates objects/classes per request | Zero instantiation overhead |
| **Dependency Injection** | Handled via constructor dependency injection | Handled via direct function parameters |

---

## 1. Object-Oriented Pattern (`repositories/`)

In an Object-Oriented architecture, data access logic is wrapped inside classes that manage database instances or connection pools as internal state.

### Implementation Example

# Comparison: Object-Oriented (Repositories) vs. Functional (DB Helpers) Data Access Patterns

When designing a backend data access layer, developers generally choose between an **Object-Oriented Architecture** (using classes and repositories) and a **Functional Architecture** (using pure database helper functions). 

The optimal choice depends heavily on your runtime environment (Node.js LTS vs. Serverless/Edge Runtime) and framework paradigm (Express vs. Hono).

---

## Overview Comparison

| Feature | Object-Oriented Pattern (`repositories/`) | Functional Pattern (`db/`) |
| :--- | :--- | :--- |
| **Primary Unit** | Classes & Instances (`class UserRepository`) | Pure Functions (`export async function getUserByEmail`) |
| **State Management** | Encapsulated in class instances (`this.db`) | Passed explicitly per execution (`db: D1Database`) |
| **Architectural Fit** | Traditional Node.js servers, Express, NestJS | Serverless Workers, Cloudflare D1, Hono |
| **Bundle Size & Tree-Shaking**| Harder to tree-shake unused class methods | Exceptional tree-shaking support |
| **Cold Start Overhead** | Instantiates objects/classes per request | Zero instantiation overhead |
| **Dependency Injection** | Handled via constructor dependency injection | Handled via direct function parameters |

---

## 1. Object-Oriented Pattern (`repositories/`)

In an Object-Oriented architecture, data access logic is wrapped inside classes that manage database instances or connection pools as internal state.

### Implementation Example

```typescript
// src/repositories/user.repository.ts
import { D1Database } from '@cloudflare/workers-types';

export interface UserRow {
  id: string;
  email: string;
}

export class UserRepository {
  constructor(private db: D1Database) {}

  async findByEmail(email: string): Promise<UserRow null |> {
    return await this.db
      .prepare('SELECT id, email FROM users WHERE email = ?')
      .bind(email)
      .first<UserRow>();
  }

  async create(id: string, email: string): Promise<void> {
    await this.db
      .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
      .bind(id, email)
      .run();
  }
}
// src/repositories/user.repository.ts
import { D1Database } from '@cloudflare/workers-types';

export interface UserRow {
  id: string;
  email: string;
}

export class UserRepository {
  constructor(private db: D1Database) {}

  async findByEmail(email: string): Promise<UserRow null |> {
    return await this.db
      .prepare('SELECT id, email FROM users WHERE email = ?')
      .bind(email)
      .first<UserRow>();
  }

  async create(id: string, email: string): Promise<void> {
    await this.db
      .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
      .bind(id, email)
      .run();
  }
}

```

# schema validotrs
create own schema validators using zod and direct acces it in handlers functions






# Migrations with an existing D1 database

This repo already uses Cloudflare D1 through the `DB` binding in `api/wrangler.jsonc`, and the current schema lives in `api/schema.sql`.

## The idea

If your database already exists, the safest approach is:

1. Treat the current schema as the **baseline**.
2. Put that schema into the **first migration file**.
3. Apply it once so D1 starts tracking migration history.
4. From then on, add small incremental migrations for every schema change.

## In this repo

Current tables are defined in `api/schema.sql`:

- `users`
- `surveys`
- `questions`
- `responses`

That file is the best source for your initial migration.

## Recommended workflow

### 1. Create the first migration

Create a migration file under `api/migrations/`, for example:

```sql
-- api/migrations/0001_baseline.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  branding TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  options TEXT DEFAULT '[]',
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);
```

Because the statements use `IF NOT EXISTS`, the baseline can be applied to an existing database safely.

Wrangler has the dbmate-style command for creating the file for you:

```bash
pnpm --filter sde-intern-task-api wrangler d1 migrations create docodego-survey-db baseline
```

### 2. Apply it locally

Use Wrangler against the local D1 copy:

```bash
pnpm --filter sde-intern-task-api wrangler d1 migrations apply docodego-survey-db --local
```

### 3. Apply it remotely

When you are ready for the real database:

```bash
pnpm --filter sde-intern-task-api wrangler d1 migrations apply docodego-survey-db --remote
```

### 4. For future changes

Do not edit the old migration. Create a new one instead:

```bash
pnpm --filter sde-intern-task-api wrangler d1 migrations create docodego-survey-db add-response-status
```

Then put only the change in that new file, for example:

```sql
ALTER TABLE responses ADD COLUMN status TEXT DEFAULT 'new';
```

## Rules to follow

- Use `CREATE TABLE IF NOT EXISTS` only for the initial baseline.
- Use `ALTER TABLE` for later schema changes.
- Put data fixes or backfills in their own migration.
- Never hand-edit the live DB if a migration can do it.

## If the database already has data

That is fine. The baseline migration should not delete anything.

If the schema is already present, the first migration mainly gives D1 a migration history to track from that point forward. After that, all new schema changes should be incremental.

## How to think about the next migration

Before creating a migration, compare **current DB schema** vs **desired schema**:

1. What table/column/index/constraint do I want?
2. Does it already exist?
3. If not, can I add it with `ALTER TABLE`, or do I need a new table?
4. Will existing rows need a default value or backfill?
5. Can this change be done safely without dropping data?

Use this rule:

- **New table** -> new migration with `CREATE TABLE`
- **New column** -> new migration with `ALTER TABLE ... ADD COLUMN`
- **Rename/change type** -> usually create a new column, backfill, then switch code
- **Remove column/table** -> only after code no longer uses it

## Example

If you want to add a response status:

1. Create a new migration file.
2. Add only the schema change:

```sql
ALTER TABLE responses ADD COLUMN status TEXT DEFAULT 'new';
```

3. Update the app code to start writing and reading `status`.
4. Keep old migrations untouched.

That is the core habit: **one schema change = one migration**.
That is the core habit: **one schema change = one migration**.
## Deep dive: when to add a migration vs when a route change is enough

Use a **migration** when the change affects stored data itself. Use a **route-only change** when the database shape stays the same and you only change how the API reads or writes it.

### Add a migration when you are:

- creating a new table
- adding a new column
- changing a column type or meaning
- adding a foreign key, unique key, or check-like constraint
- adding/removing an index
- renaming a column or table
- splitting one field into several fields
- merging several fields into one
- needing a default/backfill for old rows
- changing nullability in a way that affects existing records
- cleaning up old data in a durable way

### Route-only change is enough when you are:

- changing request validation only
- changing response JSON shape only
- changing business logic without changing storage
- mapping old stored data into a new API shape
- formatting values differently before sending them to the client
- filtering or sorting existing rows differently
- adding auth checks, permissions, or guards
- changing UI behavior with no DB impact

### Examples

**Migration needed**

- Add `status` to `responses`
- Store `published_at` for surveys
- Save `logo_url` separately instead of inside `branding`
- Add an index on `survey_id`

**Route only**

- Return `branding.color` as `themeColor` in API output
- Accept a new payload field and combine it into the same old column
- Reject invalid question types before insert
- Hide deleted surveys from responses without changing tables

### Important rule

If the route change would make old rows impossible to read correctly, you probably need a migration too.

Examples:

- You want a new required field, but old rows do not have it.
- You want to rename `answers` to `payload`.
- You want to change `branding` from JSON text to separate columns.

In those cases, do the migration first, then update the route, then deploy the code that uses the new schema.

### Safe order for schema changes

1. Add the new column/table in a migration.
2. Deploy code that can read both old and new data if needed.
3. Backfill old rows if needed.
4. Switch the route to the new shape.
5. Remove old columns only after nothing depends on them.

### Quick decision test

Ask this before every change:

> “If I deploy only the route, will the database still store and serve this data correctly for old and new records?”

- If **yes**, no migration is needed.
- If **no**, create a migration.


# adding migrations in local
pnpm dlx wrangler d1 migrations apply docodego-survey-db --local
what this commands means
# adding migrations in remote
