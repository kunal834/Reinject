import { getCookie } from 'hono/cookie' 
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'session')
  console.log('token from cookie', token) // Debugging line to check the token value

  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const payload = await verify(token, c.env.JWT_SECRET , 'HS256')
    c.set('user', payload)
    await next()
  } catch (e) {
    console.log('error', e)
    return c.json({ error: 'Invalid token' }, 401)
  }
})
