import { applyD1Migrations, env } from 'cloudflare:test'

// Runs before every test file. Already-applied migrations are skipped,
// so the test D1 always matches what `migrate:local` / `migrate:prod` produce.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
