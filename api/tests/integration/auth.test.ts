import { env } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'
import app from '../../src/index'

// Integration tests: real Hono app + real (local, in-memory) D1 with migrations applied.
// No `wrangler dev` needed — requests go straight into the app.

const uniqueEmail = () => `test-${crypto.randomUUID()}@example.com`

const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  app.request(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    },
    env,
  )

// Turns `session=abc; Path=/; HttpOnly` into `session=abc` for the next request.
const sessionCookie = (res: Response) => res.headers.get('Set-Cookie')?.split(';')[0] ?? ''

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await app.request('/api/health', {}, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })
})

describe('auth flow', () => {
  it('signup stores a hashed password and sets a session cookie', async () => {
    const email = uniqueEmail()
    const res = await post('/api/auth/signup', { name: 'Test', email, password: 'secret123' })

    expect(res.status).toBe(200)
    expect(sessionCookie(res)).toMatch(/^session=/)

    // Check the database directly — something Hurl can't do.
    const row = await env.DB.prepare('SELECT password_hash FROM users WHERE email = ?')
      .bind(email)
      .first<{ password_hash: string }>()
    expect(row?.password_hash).toBeTruthy()
    expect(row?.password_hash).not.toBe('secret123')
  })

  it('signup then /me returns the logged-in user', async () => {
    const email = uniqueEmail()
    const signup = await post('/api/auth/signup', { name: 'Test', email, password: 'secret123' })

    const me = await app.request(
      '/api/auth/me',
      { headers: { Cookie: sessionCookie(signup) } },
      env,
    )
    const body = await me.json<{ authenticated: boolean; user: { email: string } }>()

    expect(me.status).toBe(200)
    expect(body.authenticated).toBe(true)
    expect(body.user.email).toBe(email)
  })

  it('rejects a duplicate signup', async () => {
    const email = uniqueEmail()
    await post('/api/auth/signup', { name: 'Test', email, password: 'secret123' })
    const again = await post('/api/auth/signup', { name: 'Test', email, password: 'secret123' })

    expect(again.status).toBe(400)
  })

  it('rejects login with a wrong password', async () => {
    const email = uniqueEmail()
    await post('/api/auth/signup', { name: 'Test', email, password: 'secret123' })
    const res = await post('/api/auth/login', { email, password: 'wrong-password' })

    expect(res.status).toBe(400)
    expect(sessionCookie(res)).toBe('')
  })

  it('rejects an invalid signup payload with 400', async () => {
    const res = await post('/api/auth/signup', { name: '', email: uniqueEmail(), password: '1' })
    expect(res.status).toBe(400)
  })
})

describe('protected routes', () => {
  it('returns 401 without a session cookie', async () => {
    const res = await app.request('/api/surveys/list', {}, env)
    expect(res.status).toBe(401)
  })
})
