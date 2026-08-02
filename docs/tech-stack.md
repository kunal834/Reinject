# Suggested production-ready stack

## Validation

- **Zod**
- Shared schemas in `api/src/validation/` or `api/schemas/`

## Rate limiting

- **Hono middleware**
- **Upstash Redis** for distributed limits
- Or **Cloudflare Durable Objects** if you want to stay inside Cloudflare

## Auth

- **Verified email login** or **OAuth**
- **JWT** only if you also handle secret rotation and session expiry properly

## API safety

- Input validation at route boundaries
- Strict JSON response types
- Central error handling

## Data layer

- **Cloudflare D1**
- **Wrangler migrations**
- Backfills in separate migration files
One very useful but often overlooked concept in software development is backfill migrations.
In simple terms, a backfill migration is when you not only change the database structure (for example, adding a new column) but also update the old data at the same time with default or calculated values.

## Testing

- **Vitest** for unit tests
- A small API integration test layer

## Deployment

- **Cloudflare Workers**
- CI checks for `pnpm check`, `pnpm typecheck`, and build



# adding cloudflare queue 
