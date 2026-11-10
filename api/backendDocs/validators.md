# Validators

Validation is implemented in `src/validators/validator.ts` with Zod.

## Signup schema

`signupschema` requires:

- `name`: non-empty string; error message `Name is required.`
- `email`: string
- `password`: string with at least six characters; error message
  `Password must be at least 6 characters long.`

## Login schema

`loginschema` is derived from `signupschema` by removing `name`. It therefore
requires `email` and a password of at least six characters.

## JWT payload schema

`payloadschema` requires:

- `id`: string
- `email`: valid email string

`exp` and `iat` are optional numeric claims.

## Usage

Signup and login use `safeParse` and return the first validation issue as a
`400` JSON response. `/api/auth/me` validates the verified JWT payload and
returns `401` when the payload shape is invalid.

Survey creation and public response submission currently use handler-level
checks instead of dedicated Zod schemas. Email input is only checked as a
string at signup/login time; stricter email-format validation is not yet
implemented.