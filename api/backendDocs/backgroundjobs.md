# Background jobs

No background-job or queue system is implemented.

All request work is performed synchronously inside the Hono request lifecycle,
including password hashing, D1 reads/writes, survey creation, and response
storage. Cloudflare Workers scheduled events, queues, workflows, and durable
objects are not configured in `wrangler.jsonc`.