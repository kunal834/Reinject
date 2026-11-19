# Architecture Concepts

## Layer Coupling

Layer coupling happens when one layer of an application becomes directly dependent on the internal details of another layer.

For example, the HTTP handler layer uses Hono's `Context` object:

```ts
export const login = async (c: Context<Env>) => {
  const user = await findUserByEmail(c, email)
}
```

If the repository accepts that same `c` object, it must also know about Hono:

```ts
import { Context } from 'hono'

export const findUserByEmail = async (
  c: Context<Env>,
  email: string
) => {
  return c.env.DB
    .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .bind(email)
    .first()
}
```

This works technically, but it couples the repository layer to the Hono framework. The repository is no longer only a database layer; it also understands the HTTP framework and the structure of Hono's request context.

## Why Passing `c` Creates Coupling

The Hono context can contain many unrelated things:

- request data
- response helpers
- cookies
- headers
- middleware values
- environment bindings such as `DB`

The repository only needs the database. Passing the complete context gives the repository access to much more than it should need.

This creates several problems:

1. **Harder testing**

   Tests must create or mock a complete Hono context instead of providing only a database mock.

2. **Less reusability**

   A repository that requires Hono's context cannot easily be called from a background job, command-line script, scheduled task, or another framework.

3. **Framework dependency**

   If the application changes from Hono to another framework, repository functions must also be changed even though the SQL may remain the same.

4. **Unclear responsibilities**

   The repository could accidentally start reading cookies, headers, or request data. Those are HTTP concerns and belong in handlers or middleware.

## Passing Only the Required Dependency

The handler should extract the database from the context and pass only that dependency to the repository:

```ts
const user = await findUserByEmail(c.env.DB, email)
```

The repository then depends on `D1Database`, not on Hono:

```ts
export const findUserByEmail = async (
  db: D1Database,
  email: string
) => {
  return db
    .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string; email: string; password_hash: string }>()
}
```

This keeps the responsibilities separate:

```text
Handler
  - reads HTTP input
  - validates request data
  - accesses c.env.DB
  - creates HTTP responses

Repository
  - receives a database dependency
  - runs SQL queries
  - maps database results
  - does not know about Hono or HTTP
```

## Dependency Direction

The preferred dependency direction is:

```text
Handler  --->  Repository  --->  Database
  |               |
  |               +-- knows database operations
  +-- knows Hono and HTTP operations
```

The handler may use the repository, but the repository should not depend on the handler or Hono context.

## Important Clarification

Passing `c` does not automatically cause a runtime error. The query can still execute successfully. The issue is architectural: the repository becomes more difficult to test, reuse, and maintain because it depends on a larger object and on a specific web framework.

Passing `c.env.DB` keeps the repository focused on the dependency it actually needs.
