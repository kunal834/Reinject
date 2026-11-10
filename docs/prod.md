# How to fix this for production

## 1. Secure auth

- Remove the fallback JWT secret.
- Fail startup or request handling if `JWT_SECRET` is missing.
- Set the session cookie with `secure: true` in production.
- Keep `httpOnly` and `sameSite` enabled.

Example:

```ts
if (!c.env.JWT_SECRET) throw new Error('JWT_SECRET is required')
```

## 2. Fix CORS

- Allow only known origins.
- Return `false` for disallowed origins instead of a fallback string.
- Keep credentials enabled only if the frontend really needs cookies.

## 3. Fix the broken dashboard request

- Change the responses fetch URL in `web/src/routes/dashboard.tsx` to:

```ts
`${API_BASE_URL}/api/surveys/${selectedSurveyId}/responses`
```

## 4. Add real D1 migrations

- Keep `api/schema.sql` as the baseline only.
- Create migrations with Wrangler:

```bash
pnpm --filter sde-intern-task-api wrangler d1 migrations create docodego-survey-db add-field-name
```

- Put every schema change in a new migration.
- Never hand-edit the live database.

## 5. Add validation

- Use **Zod** for request validation.
- Validate request bodies before insert/update.
- Use question IDs instead of labels for stored answers.
- Reject invalid survey/question payloads at the API boundary.
- Add length limits for public submission payloads.

## 6. Protect public endpoints

- Add rate limiting with a dedicated middleware file.
- Add bot protection or a lightweight challenge if abuse is likely.
- Consider request size limits for anonymous submissions.

## 6.1 Suggested rate limiting stack

- **Upstash Redis** for distributed counters
- **Hono middleware** for request gating
- **Cloudflare KV or Durable Objects** if you want to stay fully on Cloudflare
- Keep the limiter in its own file, for example:

```text
api/middleware/rate-limit.ts
```

## 6.2 Suggested validation stack

- **Zod** for schema validation
- Shared schemas for:
  - auth payloads
  - survey create/update payloads
  - public response payloads
- Parse at the route boundary, then only work with validated data

## 7. Remove debug noise

- Delete `console.log` statements.
- Keep only actionable server-side errors.
- Use structured logging if you need production observability.

## 8. Replace `any`

- Define shared survey/question/response types.
- Type API responses and frontend state explicitly.
- Stop using label strings as identifiers for form answers.

## 9. Add tests

- Add API tests for:
  - login
  - auth guard
  - survey creation
  - public submission
  - dashboard response fetch
- Add at least one migration or schema smoke test if possible.

## 10. Improve auth model

- Replace email-only login with a real identity flow:
  - magic link
  - OAuth
  - or verified email login
- Add session expiry handling and logout invalidation.

## 11. Production pipeline

- Run `pnpm check`, `pnpm typecheck`, and build in CI.
- Include API checks in the release pipeline.
- Require migration application before deploy.



# Architecture Diffenrce 
# Architecture Comparison: Controller vs. Handler

| Feature | Controller Architecture | Handler Architecture |
| :--- | :--- | :--- |
| **Core Concept** | A single **class** that groups multiple related HTTP endpoints for a domain resource. | A single **function** dedicated strictly to processing one specific endpoint event. |
| **Programming Paradigm** | Object-Oriented Programming (OOP) | Functional Programming |
| **Organization Unit** | Grouped by **Entity** (e.g., `UserController` contains `getUser`, `createUser`, `deleteUser`). | Grouped by **Action** (e.g., `getUser.handler.ts` only handles `GET /user`). |
| **Common Frameworks** | NestJS, Spring Boot, Express (MVC style), Laravel, ASP.NET Core. | Hono, Fastify, Cloudflare Workers, AWS Lambda, Go (`http.HandlerFunc`). |
| **Memory & Performance** | Heavier footprint; imports entire class dependencies even for a single route execution. | Highly tree-shakeable; minimal memory usage and zero-overhead cold starts on serverless runtime. |
| **Dependency Management** | Injected via Class Constructors (Dependency Injection containers). | Passed as explicit arguments or pulled from function context (e.g., `c.env`). |

---

## Code Comparison

### 1. Controller Approach (Class-Based)

```typescript
// controllers/user.controller.ts
export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response) {
    const user = await this.userService.find(req.params.id);
    return res.json(user);
  }

  async createUser(req: Request, res: Response) {
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  }
}

Handler Approach (Function-Based)
TypeScript
// handlers/get-user.handler.ts
export const handleGetUser = async (c: Context) => {
  const userId = c.req.param('id');
  const user = await userService.find(userId);
  return c.json(user);
};

// handlers/create-user.handler.ts
export const handleCreateUser = async (c: Context) => {
  const body = await c.req.json();
  const user = await userService.create(body);
  return c.json(user, 201);
};