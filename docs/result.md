# Production readiness result

This project is **not production ready** yet.

## Main blockers

1. **Auth is insecure**
   - `api/routes/auth.ts` and `api/middleware/auth.ts` both fall back to `'fallback-local-secret-key'` when `JWT_SECRET` is missing.
   - The session cookie is set with `secure: false`, so it is not protected correctly in production.

2. **CORS is misconfigured**
   - `api/src/index.ts` returns a fallback origin instead of rejecting disallowed origins.
   - That can allow unexpected cross-origin behavior instead of failing closed.

3. **The dashboard has a broken API URL**
   - `web/src/routes/dashboard.tsx` calls:
     - `/api/surveys/surveys/${selectedSurveyId}/responses`
   - The extra `/surveys` segment makes the responses request wrong.

4. **There is no real migration workflow**
   - The schema is kept in `api/schema.sql`, but the repo does not yet show a proper migration history or rollout strategy.
   - That is risky once the database changes after launch.

5. **Validation is too loose**
   - API routes accept payloads with minimal shape checks.
   - Frontend form state is stored with `any` in multiple places.
   - Answer keys use question labels, which can collide or change later.

6. **Anonymous public submission has no abuse protection**
   - `api/routes/public.ts` accepts survey responses without rate limiting, bot protection, or payload limits.

7. **Debug logging is still everywhere**
   - Many `console.log` and `console.error` statements remain across API and web code.
   - That is noisy and can leak sensitive data or internal state.

8. **Type safety is weak**
   - `any` is used heavily in the UI context, builder, dashboard, and survey routes.
   - That makes regressions easier to ship.

9. **No test coverage is visible**
   - I do not see tests for auth, survey creation, public submission, or response loading.

10. **Auth is email-only**
    - The login flow creates or reuses a user from any email address with no verification step.
    - That is fine for a demo, but not for a real production identity system.

11. **The root build/deploy story is incomplete**
    - The root `build` script only builds the web app.
    - There is no clearly enforced production pipeline for API, migrations, and checks together.

