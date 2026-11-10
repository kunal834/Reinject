import { describe, expect, it } from 'vitest'
import { loginschema, payloadschema, signupschema } from '../../src/validators/validator'

// Unit tests: pure functions only — no DB, no HTTP, no Hono.

describe('signupschema', () => {
  it('accepts a valid payload', () => {
    const result = signupschema.safeParse({
      name: 'Kunal',
      email: 'k@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty name', () => {
    const result = signupschema.safeParse({
      name: '',
      email: 'k@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Name is required.')
  })

  it('rejects a password shorter than 6 characters', () => {
    const result = signupschema.safeParse({
      name: 'Kunal',
      email: 'k@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Password must be at least 6 characters long.')
  })

  // Found while writing these tests: `email` is z.string(), so any string passes.
  // Switch it to z.email() and turn this todo into a real test.
  it.todo('rejects an invalid email format')
})

describe('loginschema', () => {
  it('does not require a name', () => {
    const result = loginschema.safeParse({ email: 'k@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })
})

describe('payloadschema', () => {
  it('accepts a JWT payload with id and email', () => {
    const result = payloadschema.safeParse({ id: 'u1', email: 'k@example.com', exp: 123 })
    expect(result.success).toBe(true)
  })

  it('rejects a payload without an id', () => {
    const result = payloadschema.safeParse({ email: 'k@example.com' })
    expect(result.success).toBe(false)
  })
})
