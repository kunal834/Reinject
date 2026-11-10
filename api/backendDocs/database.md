# Database

The API uses Cloudflare D1 (SQLite) through the `DB` binding configured in
`wrangler.jsonc`. The current schema is represented by `schema.sql` and the
three migrations in `migrations/`.

## Tables

### `users`

Stores user accounts:

- `id` text primary key
- `name` required text
- `email` required and unique
- `password_hash` required text
- `created_at` timestamp with a current-time default

Passwords are hashed with bcryptjs before insertion.

### `surveys`

Stores survey metadata:

- `id` text primary key
- `owner_id` references `users(id)` with `ON DELETE CASCADE`
- `title` required text
- `branding` JSON serialized as text, defaulting to `{}`
- `created_at` timestamp with a current-time default

### `questions`

Stores survey questions:

- `id` text primary key
- `survey_id` references `surveys(id)` with `ON DELETE CASCADE`
- `type` and `label` required text
- `options` JSON serialized as text, defaulting to `[]`
- `sort_order` required integer

### `responses`

Stores submitted answers:

- `id` text primary key
- `survey_id` references `surveys(id)` with `ON DELETE CASCADE`
- `answers` JSON serialized as text
- `created_at` timestamp with a current-time default

## Database access

Handlers use prepared statements with bound parameters for user-controlled
values. Survey creation uses `DB.batch()` so the survey and its questions are
submitted together. JSON columns are serialized on writes and parsed in the
handlers on reads.

Migration commands are defined in `package.json`:

```text
pnpm migrate:local
pnpm migrate:prod
```

There is no repository-level transaction abstraction or database repository
layer; database operations are currently performed directly in handlers.