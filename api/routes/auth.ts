import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import {login} from '../handlers/auth.handler'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/login', login)

auth.get('/me', async (c) => {
  // 1. Try Cookie, OR try Authorization Header
  const cookieToken = getCookie(c, 'session')
  const authHeader = c.req.header('Authorization')?.replace('Bearer ', '')
  const token = cookieToken || authHeader

  if (!token) {
    console.log('No token found in cookie or header.')
    return c.json({ success: false, authenticated: false, error: 'No token provided' }, 401)
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET , 'HS256')
    console.log('payload', payload)
    return c.json({
      success: true,
      authenticated: true,
      user: { id: payload.id, email: payload.email },
    })
  } catch (error) {
    // THIS LINE IS CRITICAL: It tells you EXACTLY why it failed
    console.error('JWT Verification Error Details:', error)

    return c.json(
      {
        success: false,
        authenticated: false,
        error: 'Session invalid or expired',
      },
      401,
    )
  }
})
auth.post('/logout', (c) => {
  deleteCookie(c, 'session')
  return c.json({ success: true, message: 'Logged out cleanly.' })
})

export default auth
