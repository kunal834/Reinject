# Repository Layer Fixes

## Incorrect or incomplete implementations

- [ ] Remove the trailing `}q` syntax error from `insertSurveyResponse` in `api/src/db/app.repo.ts`.
- [ ] Split `app.repo.ts` into feature-specific repository files, such as `auth.repository.ts` and `survey.repository.ts`.
- [ ] Change repository functions to accept `D1Database` instead of Hono `Context`.
- [ ] Pass `c.env.DB` from handlers to repository functions.
- [ ] Remove database logs that print password hashes or complete user records.
- [ ] Preserve the original database errors instead of replacing every database exception with a generic repository error.
- [ ] Remove or use the unused `isinserteduser` value in `auth.handler.ts`.
- [ ] Remove debug logging from repository functions and handlers where it is no longer needed.

## Signup ID fix

- [ ] Generate `newUserId` once in `signup`.
- [ ] Pass `newUserId` to `insertuser`.
- [ ] Make `insertuser` accept `id` as an argument.
- [ ] Bind the same `newUserId` that is inserted into the database and included in the JWT.
- [ ] Remove `crypto.randomUUID()` from inside `insertuser`.

## Survey response serialization fix

- [ ] In `public.handler.ts`, pass the original `answers` object to `insertSurveyResponse`.
- [ ] Remove the extra `JSON.stringify(answers)` call from `public.handler.ts`.
- [ ] Serialize `answers` exactly once inside `insertSurveyResponse`.
- [ ] Change the repository parameter type from `any` to `unknown` or a Zod-inferred answer type.

## Repository function improvements

- [ ] Select only required user fields instead of `SELECT *`.
- [ ] Name database-bound types consistently, such as `User`, `Survey`, and `SurveyQuestion`.
- [ ] Return typed database results from repository functions.
- [ ] Keep SQL and database result mapping inside repository functions.
- [ ] Keep Zod validation, password comparison, JWT creation, cookies, and HTTP responses outside repository functions.
- [ ] Add explicit parameterized bindings to every repository query.
- [ ] Wrap the public survey lookup and question lookup as separate typed repository functions.

## Suggested target structure

```text
api/src/
  db/
    auth.repository.ts
    survey.repository.ts
  handlers/
  routes/
  validators/
```

## Verification

- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run the signup flow and confirm that the database user ID matches the JWT ID.
- [ ] Run a survey response submission and verify answers are stored as valid JSON.
- [ ] Confirm repository files contain SQL and handlers contain no SQL.

# Production Readiness

## Repository and handler separation

- [ ] Add `await` before all repository delete, insert, update, and transaction calls.
- [ ] Remove the remaining direct database calls from handlers.
- [ ] Remove commented SQL and obsolete implementation comments.
- [ ] Replace `any` repository and handler types with explicit interfaces or Zod-inferred types.
- [ ] Add typed database return types for every repository function.
- [ ] Use consistent repository and database-bound naming conventions.

## Security

- [ ] Add a real `.dev.vars` setup and document required environment variables.
- [ ] Ensure `JWT_SECRET` is present before local development and deployment.
- [ ] Set the session cookie `secure` flag appropriately for HTTPS production.
- [ ] Restrict CORS origins through environment-specific configuration.
- [ ] Add rate limiting to signup, login, survey submission, and public endpoints.
- [ ] Verify JWT issuer, audience, expiration, and algorithm checks consistently.
- [ ] Normalize and validate email and survey title input.
- [ ] Enforce ownership checks for every survey and response operation.
- [ ] Audit logs and remove sensitive request, password, hash, and token output.

## Database correctness

- [ ] Confirm migrations run cleanly from an empty database.
- [ ] Add a database constraint or safe lookup for duplicate titles per owner.
- [ ] Make survey title comparison case-insensitive and trim whitespace.
- [ ] Add indexes for `surveys(owner_id)`.
- [ ] Add indexes for `questions(survey_id, sort_order)`.
- [ ] Add indexes for `responses(survey_id)`.
- [ ] Make survey creation atomic across the survey and question inserts.
- [ ] Surface database constraint failures to handlers in a controlled response.
- [ ] Add migration rollback/recovery notes for existing deployments.

## Validation and API behavior

- [ ] Validate email format in signup and login schemas.
- [ ] Use consistent HTTP status codes and JSON error response shapes.
- [ ] Add centralized HTTP error handling.
- [ ] Return 404 for missing surveys and 403 for ownership violations.
- [ ] Prevent invalid survey IDs and response payloads from reaching the database.
- [ ] Define and document pagination for survey list endpoints.
- [ ] Add request size limits where appropriate.

## Error handling and observability

- [ ] Replace generic catch errors with typed or centralized error handling.
- [ ] Preserve database error information for logs without exposing it to clients.
- [ ] Add structured request and error logging.
- [ ] Add request IDs or correlation IDs.
- [ ] Track key metrics for auth failures, database latency, and endpoint errors.
- [ ] Configure Cloudflare deployment alerts and error monitoring.

## Testing

- [ ] Add signup success and duplicate-email tests.
- [ ] Add invalid-email and invalid-password tests.
- [ ] Add login success and wrong-password tests.
- [ ] Add JWT cookie, logout, and expired-token tests.
- [ ] Add survey create, duplicate-title, list, and delete tests.
- [ ] Add cross-user ownership tests for survey response and deletion routes.
- [ ] Add public survey lookup, missing-survey, and response submission tests.
- [ ] Add database migration tests from a clean database.
- [ ] Run type checking and integration tests in CI.

## Performance and infrastructure

- [ ] Measure endpoint latency and database query counts.
- [ ] Cache public survey definitions only after invalidation rules are defined.
- [ ] Choose Cloudflare KV, Durable Objects, or Redis for each caching need.
- [ ] Use short TTLs and explicit invalidation for survey cache entries.
- [ ] Add Cloudflare Queues for slow work such as email and analytics aggregation.
- [ ] Add retry, idempotency, and dead-letter handling for background jobs.
- [ ] Track background job status and failures.
- [ ] Configure environment-specific bindings and secrets.

## Deployment

- [ ] Verify all migrations against remote D1.
- [ ] Configure production and preview environment variables separately.
- [ ] Add a production smoke-test script.
- [ ] Document local development and deployment commands.
- [ ] Document API authentication and response formats.
