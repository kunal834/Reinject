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
