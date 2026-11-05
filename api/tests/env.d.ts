// Extra bindings that exist only in tests (see vitest.config.ts → miniflare.bindings).
declare namespace Cloudflare {
  interface Env {
    TEST_MIGRATIONS: import('@cloudflare/vitest-pool-workers').D1Migration[]
  }
}
