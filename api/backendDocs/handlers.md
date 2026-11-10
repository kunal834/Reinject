# Request handlers

Handlers are grouped by route concern under `src/handlers/`.

## Authentication handlers

`auth.handler.ts` implements:

- `signup`: validates `name`, `email`, and `password`; normalizes the email;
  hashes the password with bcryptjs; inserts the user; signs a seven-day HS256
  JWT; and sets it in the `session` cookie.
- `login`: validates credentials, looks up the user with a bound D1
  parameter, compares the password hash, and sets the same seven-day session
  cookie.
- `userinfo`: reads the session cookie first and then an `Authorization:
  Bearer <token>` header, verifies the JWT, validates its payload, and returns
  the authenticated user.

Authentication failures use JSON responses with status `400`, `401`, or `500`
depending on the failure.

## Survey handlers

`survey.handler.ts` implements:

- `createSurvey`: accepts a title, question array, and branding; creates a
  survey UUID and question UUIDs; stores JSON fields in D1; and writes the
  survey plus questions in one D1 batch.
- `surveylist`: returns surveys owned by the authenticated user, including
  question and response counts and parsed question JSON.
- `responses`: checks survey ownership before returning responses ordered by
  newest first, with parsed answer JSON.

## Public handlers

`public.handler.ts` implements:

- `getpublicSurvey`: loads a survey and its questions ordered by
  `sort_order`, then parses branding and question options from JSON.
- `submitSurveyResponse`: validates that `answers` is an object and stores the
  serialized answer payload in D1.

Handlers currently use direct D1 queries; there is no separate service layer.