# Services

No separate service layer is currently implemented.

Route handlers call D1 directly and contain the authentication, survey, and
response business logic. Shared concerns currently live in Hono middleware
(`src/middleware/auth.ts`) and Zod schemas
(`src/validators/validator.ts`).

If the API grows, database access and reusable business operations can be
extracted from the handlers into services without changing the route contract.