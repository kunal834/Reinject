import path from 'node:path'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  // Read migrations in Node, then hand them to the Workers runtime as a binding.
  // tests/setup/apply-migrations.ts applies them to the test D1 before tests run.
  const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'))

  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          // These override .dev.vars, and D1 is a local in-memory copy — tests never touch remote data.
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
