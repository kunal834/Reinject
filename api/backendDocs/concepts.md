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

## D1 Prepared Statements and `async`/`await`

When working with Cloudflare D1, distinguish between **constructing** a prepared statement and **executing** it.

### Constructing a statement

`prepare()` and `bind()` only build a `D1PreparedStatement`. They do not send a query to the database, so the repository function does not need `async` or `await`:

```ts
export const insertQuestion = (
  db: D1Database,
  id: string,
  surveyId: string,
  label: string,
) => {
  return db
    .prepare(`
      INSERT INTO questions (id, survey_id, label)
      VALUES (?, ?, ?)
    `)
    .bind(id, surveyId, label)
}
```

The return type is:

```ts
D1PreparedStatement
```

### Executing a statement

Methods such as `run()`, `first()`, `all()`, and `batch()` perform database I/O. They return Promises, so they must be awaited:

```ts
const statement = insertQuestion(db, id, surveyId, label)

await statement.run()
```

Common D1 operations:

```ts
const statement = db.prepare(sql).bind(value) // construct: no await

await statement.run()                         // execute a write
await statement.first()                       // execute and get one row
await statement.all()                         // execute and get many rows
await db.batch([statement1, statement2])      // execute many statements
```

### Why marking a constructor function `async` causes problems

An `async` function always returns a Promise. Therefore, this function:

```ts
const insertQuestion = async (...) => {
  return db.prepare(sql).bind(...)
}
```

returns:

```ts
Promise<D1PreparedStatement>
```

This can break batching:

```ts
const statements = questions.map((question) => insertQuestion(...))
await db.batch(statements)
```

`statements` is now an array of Promises, but `db.batch()` expects an array of `D1PreparedStatement` objects.

The correct pattern is:

```ts
const statements = questions.map((question) => insertQuestion(...))
await db.batch(statements)
```

This works because `insertQuestion` is synchronous and returns prepared statements directly.

### The caller must await asynchronous repository functions

If a repository function calls `.all()`, `.first()`, `.run()`, or `.batch()`, it is asynchronous:

```ts
export const getSurveys = async (db: D1Database, ownerId: string) => {
  return db
    .prepare('SELECT * FROM surveys WHERE owner_id = ?')
    .bind(ownerId)
    .all()
}
```

The handler must await it:

```ts
const { results } = await getSurveys(c.env.DB, user.id)
```

Without `await`, the handler receives a Promise instead of the database result:

```ts
const { results } = getSurveys(c.env.DB, user.id) // incorrect
```

### Mental model

```text
prepare() + bind()  -> build a statement       -> no await
run()               -> execute a write         -> await
first()             -> execute and get one row -> await
all()               -> execute and get rows    -> await
batch()             -> execute many statements -> await
```

The general rule is: use `async`/`await` at the point where database work is executed, not at the point where a prepared statement is merely constructed.

## General `async`/`await` Concepts

`async` and `await` are used for operations whose result will be available later. This is common for database queries, HTTP requests, file operations, and other asynchronous work.

### What `async` does

Declaring a function as `async` always makes it return a Promise, even when the function returns an ordinary value:

```ts
const getName = async () => {
  return 'Ada'
}

const value = getName()
// value is Promise<string>, not string
```

To get the returned value, the caller must use `await`:

```ts
const name = await getName()
// name is string
```

Because `await` can only be used inside an asynchronous function, the caller usually also needs to be declared as `async`:

```ts
const handler = async () => {
  const name = await getName()
}
```

### When to use `async`

Use `async` when a function:

- calls an asynchronous function and needs its result;
- executes a database operation such as `run()`, `first()`, `all()`, or `batch()`;
- makes an HTTP request with `fetch()`;
- needs to use `await` inside its body;
- returns a Promise intentionally.

Example:

```ts
export const findUser = async (db: D1Database, email: string) => {
  return db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first()
}
```

The function is asynchronous because `.first()` executes a database query.

### When not to use `async`

Do not add `async` merely because a function is related to a database. Do not use it when the function only:

- validates data;
- transforms an object;
- calculates a value;
- constructs a SQL query;
- creates and binds a prepared statement;
- returns a value that is already available.

Example:

```ts
export const makeQuestionStatement = (
  db: D1Database,
  id: string,
  label: string,
) => {
  return db
    .prepare('INSERT INTO questions (id, label) VALUES (?, ?)')
    .bind(id, label)
}
```

This function is synchronous because it only constructs a statement. Adding `async` would unnecessarily change its return type from `D1PreparedStatement` to `Promise<D1PreparedStatement>`.

### Returning values from asynchronous functions

An asynchronous function can return the result of an asynchronous operation directly:

```ts
export const findUser = async (db: D1Database, email: string) => {
  return db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first()
}
```

The caller awaits the repository function:

```ts
const user = await findUser(c.env.DB, email)
```

This is equivalent to writing:

```ts
export const findUser = async (db: D1Database, email: string) => {
  const result = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first()

  return result
}
```

The second form is useful when you need to inspect, transform, or validate the result before returning it. Otherwise, returning the Promise directly is simpler.

### Inserting data and returning the result

For an insert, statement construction and execution are separate:

```ts
export const insertUser = (
  db: D1Database,
  id: string,
  email: string,
) => {
  // Synchronous: construct the statement
  return db
    .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
    .bind(id, email)
}
```

The service or higher-level repository function executes it and returns the result:

```ts
export const createUser = async (
  db: D1Database,
  id: string,
  email: string,
) => {
  const statement = insertUser(db, id, email)

  // Asynchronous: execute the insert
  const result = await statement.run()

  return result
}
```

The caller must await the returned execution result:

```ts
const result = await createUser(db, id, email)
console.log(result.meta.last_row_id)
```

For an insert where the caller does not need the D1 metadata, the function can simply await execution:

```ts
export const createUser = async (db: D1Database, id: string, email: string) => {
  await insertUser(db, id, email).run()
}
```

### Error handling

`try/catch` catches errors from asynchronous work only when the Promise is awaited inside the `try` block:

```ts
try {
  const user = await findUser(db, email)
  return user
} catch (error) {
  console.error('Failed to find user:', error)
  throw new Error('Repository error while finding user')
}
```

This is unsafe because the Promise is not awaited inside the `try` block:

```ts
try {
  return findUser(db, email) // errors may escape this try/catch
} catch (error) {
  // may not run for the rejected Promise
}
```

### Practical decision checklist

Before adding `async`, ask:

1. Does this function call an operation that returns a Promise?
2. Does it need to wait for that Promise?
3. Does it need to return the resolved result to its caller?

If the function only builds or transforms a value, keep it synchronous. If it performs or waits for I/O, make it asynchronous and await it at the call site.

## Sync vs Async: A Rule for Future Projects

The most important rule is:

> Make a function `async` only when it needs to wait for work that will finish later.

### Use a synchronous function when the result is already available

Use a normal function when it only calculates, validates, transforms, or constructs a value in memory:

```ts
function add(a: number, b: number) {
  return a + b
}

function formatName(name: string) {
  return name.trim().toUpperCase()
}

function createStatement(db: D1Database, id: string) {
  return db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
}
```

These return their values directly:

```ts
const total = add(2, 3)
const name = formatName(' Ada ')
const statement = createStatement(db, id)
```

### Use an asynchronous function when it waits for an external system

Use `async` when the function performs database I/O, makes an HTTP request, reads from a file, uses a queue, or calls another function that returns a Promise:

```ts
async function getUser(db: D1Database, id: string) {
  return await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first()
}
```

The caller must await the result:

```ts
const user = await getUser(db, id)
```

### Do not add `async` just in case

An unnecessary `async` changes the return type and forces every caller to use `await`:

```ts
async function formatName(name: string) {
  return name.trim().toUpperCase()
}
```

This returns `Promise<string>`, even though no asynchronous work exists. Prefer:

```ts
function formatName(name: string) {
  return name.trim().toUpperCase()
}
```

### Remember the return-type difference

```ts
function getValue() {
  return 10
}
// number
```

```ts
async function getValueAsync() {
  return 10
}
// Promise<number>
```

The asynchronous version must be resolved with `await`:

```ts
const value = await getValueAsync()
```

### The insert pattern

Separate constructing a database statement from executing it:

```ts
function insertUserStatement(db: D1Database, id: string) {
  // Synchronous: only constructs a statement
  return db
    .prepare('INSERT INTO users (id) VALUES (?)')
    .bind(id)
}

async function insertUser(db: D1Database, id: string) {
  const statement = insertUserStatement(db, id)

  // Asynchronous: executes the database operation
  return await statement.run()
}
```

For D1, remember:

```text
prepare + bind   -> synchronous statement construction
run              -> asynchronous write execution
first            -> asynchronous query for one row
all              -> asynchronous query for many rows
batch            -> asynchronous execution of multiple statements
```

### Final decision checklist

Before adding `async`, ask:

1. Does this function call `fetch`, a database execution method, or another async function?
2. Does it need to wait for the result?
3. Will the caller need the resolved value?

If yes, use `async` and `await`. If the function only validates, calculates, transforms, or constructs something, keep it synchronous.

## JSON Request Values and D1 Text Columns

A request body can be valid JSON while still containing values that cannot be bound directly to D1.

For example, this request is valid:

```json
{
  "type": "rating",
  "label": "How would you rate your experience?",
  "options": ["1", "2", "3", "4", "5"]
}
```

After the handler calls `await c.req.json()`, `options` is a JavaScript array:

```ts
['1', '2', '3', '4', '5'] // typeof value === 'object'
```

It is no longer a JSON text string. Cloudflare D1 prepared-statement parameters support primitive values, but an array or object cannot be bound directly to a `TEXT` column. Passing the array directly causes an error such as:

```text
D1_TYPE_ERROR: Type 'object' not supported for value '1,2,3,4,5'
```

Serialize structured values at the database boundary:

```ts
const serializedOptions = JSON.stringify(options ?? [])

return db.prepare(`
  INSERT INTO questions
    (id, survey_id, type, label, options, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`).bind(
  questionId,
  surveyId,
  type,
  label,
  serializedOptions,
  sortOrder,
)
```

The database stores the value as text, for example:

```text
["1","2","3","4","5"]
```

When reading it back, convert the text to a JavaScript value:

```ts
const options = JSON.parse(row.options || '[]')
```

### Handling invalid existing rows

If rows were inserted before serialization was added, they may contain an empty string, comma-separated text, or another invalid JSON value. Parsing those rows can cause:

```text
SyntaxError: Unexpected end of JSON input
```

This is a read-side data problem, separate from the original D1 binding error. During debugging, log the raw value and use a safe parser:

```ts
const parseJson = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== 'string' || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const formattedQuestion = {
  ...row,
  options: parseJson(row.options, [] as string[]),
}
```

For local test data, delete and recreate rows that were written with the old format. Restart the Wrangler dev process after changing repository code, and search for every insert path if the old D1 error continues:

```text
rg "INSERT INTO questions|\.bind|options" api/src
```

The key distinction is:

```text
HTTP JSON array -> JavaScript array -> JSON.stringify() -> D1 TEXT column
D1 TEXT column  -> JSON.parse()        -> JavaScript array
```

### Complete survey-creation failure pattern

The survey creation bug followed this sequence:

```text
1. Client sends valid JSON with options: [] or ["1", "2", "3"]
2. c.req.json() parses the body
3. q.options is now already a JavaScript array
4. JSON.parse(q.options) is called incorrectly
5. [] becomes an empty string during coercion
6. JSON.parse('') throws Unexpected end of JSON input
```

For a non-empty array, incorrectly calling `JSON.parse()` can also produce an error because an array is not JSON text. The fix is not to parse the request value again:

```ts
// Incorrect: q.options is already an array
JSON.parse(q.options || '[]')

// Correct: pass the array to the insert function
q.options ?? []
```

The insert function is the serialization boundary:

```ts
const questionStatements = questions.map((question, index) =>
  insertQuestionStatement(
    db,
    crypto.randomUUID(),
    surveyId,
    question.type,
    question.label,
    question.options ?? [],
    index,
  )
)
```

The statement constructor converts the array to text exactly once:

```ts
function insertQuestionStatement(
  db: D1Database,
  id: string,
  surveyId: string,
  type: string,
  label: string,
  options: string[],
  sortOrder: number,
) {
  return db.prepare(`
    INSERT INTO questions
      (id, survey_id, type, label, options, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    surveyId,
    type,
    label,
    JSON.stringify(options ?? []),
    sortOrder,
  )
}
```

### Practical debugging checklist

When a JSON/D1 error occurs, identify which representation is currently in use:

```text
HTTP request body       -> JSON text on the wire
c.req.json() result     -> JavaScript object/array
D1 bind parameter       -> primitive value, usually JSON text for arrays/objects
D1 query result         -> database text
JSON.parse(query value) -> JavaScript object/array
```

Then check the following in order:

1. Log the value and `typeof` immediately before `.bind()`.
2. Confirm arrays and objects are passed through `JSON.stringify()` exactly once.
3. Confirm `JSON.parse()` is used only on values read from a `TEXT` column.
4. Search for another insert path if the old D1 type error continues.
5. Inspect old local rows if parsing fails after the insert code is fixed.
6. Restart Wrangler so the request uses the latest Worker bundle.

Do not fix a database serialization problem by changing a valid client payload into a JSON string. Keep the API contract as arrays and objects, and serialize only at the database boundary.
