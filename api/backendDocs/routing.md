
# Routing

The API uses Hono in `src/index.ts`. All application routes are mounted below
`/api`, and unknown routes return a JSON 404 response:

```json
{ "message": "This page does not exist." }
```

## Global middleware

`/api/*` uses Hono CORS middleware with:

- Allowed origins: `http://localhost:5173` and `https://formflow-app.pages.dev`
- Credentials enabled
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Headers: `Content-Type`, `Authorization`

## Routes

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Create a user and session |
| POST | `/api/auth/login` | No | Authenticate a user and create a session |
| GET | `/api/auth/me` | No* | Validate the session and return the current user |
| POST | `/api/auth/logout` | No | Delete the session cookie |
| GET | `/api/surveys/list` | Session cookie | List the authenticated user's surveys |
| POST | `/api/surveys/build` | Session cookie | Create a survey and its questions |
| GET | `/api/surveys/:id/responses` | Session cookie | List responses owned by the authenticated user |
| GET | `/api/public/survey/:id` | No | Read a public survey layout |
| POST | `/api/public/survey/:id/respond` | No | Submit a public survey response |

`/api/surveys/*` is protected by `authMiddleware`. The `/api/auth/me` handler
performs its own cookie or bearer-token verification.
