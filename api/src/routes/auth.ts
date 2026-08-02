import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import {login , signup, userinfo } from '../handlers/auth.handler'

const auth = new Hono<{ Bindings: Env }>()
// Bindings type definition passes the environment variables into the execution context
// bindings are used to access the database and JWT secret in the handler functions

auth.post('/login', login);
auth.post('/signup', signup);
auth.get('/me', userinfo);
auth.post('/logout', (c) => {
  deleteCookie(c, 'session')
  return c.json({ success: true, message: 'Logged out cleanly.' })
})

export default auth
