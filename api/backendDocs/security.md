# Security

## Authentication

Authentication uses JWTs signed with the `JWT_SECRET` environment binding and
the HS256 algorithm. Signup and login issue a token with a seven-day `exp`
claim. The token is stored in a `session` cookie configured with:

- `HttpOnly`
- `SameSite=Lax`
- Seven-day `maxAge`

The current cookie configuration sets `secure: false`, so HTTPS-only cookie
transport is not enabled yet.

## Authorization

All `/api/surveys/*` routes use `authMiddleware`. The middleware reads the
`session` cookie, verifies the JWT, stores the payload in Hono context, and
returns `401` for missing or invalid tokens.

The response-list handler additionally checks that the authenticated user owns
the requested survey and returns `403` otherwise. Public survey reading and
response submission intentionally do not require authentication.

## Input and query handling

- Signup and login payloads are validated with Zod.
- JWT payloads returned by `/api/auth/me` are validated with Zod.
- Survey response submission checks that `answers` is an object.
- D1 queries use prepared statements and bound parameters for IDs, emails, and
  other request values.
- Passwords are never stored as plaintext; bcryptjs hashes them with a cost of
  10.

## Current gaps

- Email validation currently uses `z.string()` rather than an email-specific
  Zod validator.
- Several survey payload fields use basic presence/type checks rather than a
  complete schema.
- There is no rate limiting, CSRF protection, refresh-token rotation, or
  application-level audit logging implemented.