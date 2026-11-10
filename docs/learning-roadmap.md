# Survey SaaS Learning Roadmap

This project is best used to learn **backend depth + distributed systems basics** through one product.

## Goal

Build the survey app in small layers so each layer teaches something real:

1. API contracts
2. data access
3. business logic
4. async jobs
5. reliability
6. observability
7. distributed behavior

## Phase 1: Core API

- Define Zod schemas for every request and response shape.
- Keep schemas close to routes, then move shared ones into a common folder.
- Validate all user input at the boundary.
- Return predictable error formats.

**Learn:** contract-first design, validation, safe API boundaries.

## Phase 2: Repository Layer

- Create a repository layer for all DB reads/writes.
- Keep SQL out of route handlers.
- Make each repository method do one thing.
- Prefer small methods like `createUser`, `findUserByEmail`, `createSurvey`, `listSurveysByOwner`.

**Learn:** data access patterns, separation of concerns, maintainable DB code.

## Phase 3: Service Layer

- Put business rules in services, not handlers.
- Keep routes thin: parse input, call service, return response.
- Use services to coordinate multiple repository calls.

**Learn:** workflow orchestration, clean architecture basics.

## Phase 4: Async Jobs

- Add Cloudflare Queues for email and slow side effects.
- Keep the main request fast.
- Move welcome emails, invite emails, survey notifications, and webhooks into jobs.

**Learn:** async processing, background execution, queue-based design.

## Phase 5: Reliability

- Make job handlers idempotent.
- Add retries for transient failures.
- Handle duplicate messages safely.
- Track failed jobs and decide when to stop retrying.

**Learn:** failure handling, exactly-once vs at-least-once behavior, practical reliability.

## Phase 6: Outbox Pattern

- Write the main DB change first.
- Store an event/outbox record in the same transaction.
- Publish the queued message from the outbox.
- Use this when you need DB state and async side effects to stay aligned.

**Learn:** consistency across database changes and background processing.

## Phase 7: Observability

- Add structured logs.
- Track request IDs / correlation IDs.
- Log job start, success, and failure.
- Add basic metrics for queue depth, failed jobs, and latency.

**Learn:** debugging production systems, tracing async flows.

## Phase 8: Distributed Systems Concepts

- Idempotency keys
- Retries with backoff
- Dead-letter queues
- Eventual consistency
- Duplicate delivery
- Message ordering tradeoffs
- Rate limiting and backpressure

**Learn:** how real systems fail and recover.

## Phase 9: Product Scenarios to Implement

Build these in order:

1. Signup and login
2. Create survey
3. Submit response
4. Send welcome email
5. Send survey notification email
6. Admin review/moderation flow
7. Audit log for sensitive actions
8. Background reporting job

## Recommended Build Order

1. Zod schemas
2. Repository layer
3. Service layer
4. Cloudflare Queues
5. Retry/idempotency handling
6. Outbox pattern
7. Logging and metrics

## What This Teaches

This project will give you:

- strong backend fundamentals
- async job processing
- reliable workflow design
- failure handling
- a real intro to distributed systems

## Rule of Thumb

If a feature can fail, duplicate, or delay, treat it like a distributed-system problem.

