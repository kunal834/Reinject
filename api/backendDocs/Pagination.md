# Pagination

Pagination is not implemented.

Current list endpoints return all matching records:

- `GET /api/surveys/list` returns all surveys owned by the current user.
- `GET /api/surveys/:id/responses` returns all responses for the survey.

Neither endpoint accepts page, cursor, limit, or offset parameters, and the
responses endpoint only applies descending `created_at` ordering.