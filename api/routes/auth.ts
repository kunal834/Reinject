import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/login', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: "Please provide a valid email address." }, 400)
    }

    const cleanEmail = email.toLowerCase().trim()

    let user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?") // we will not use email variable directly in query to prevent SQL injection
      .bind(cleanEmail)
      .first<{ id: string; email: string }>()

    if (!user) {
      // creating a new user
      const newUserId = crypto.randomUUID()
      await c.env.DB.prepare("INSERT INTO users (id, email) VALUES (?, ?)")
        .bind(newUserId, cleanEmail)
        .run()
      
      user = { id: newUserId, email: cleanEmail }
    }

    // Double check secret exists
    if (!c.env.JWT_SECRET) {
      console.error("CRITICAL: c.env.JWT_SECRET is missing!");
    }

    const token = await sign(
      { 
        id: user.id, 
        email: user.email, 
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) 
      }, 
      c.env.JWT_SECRET || 'fallback-local-secret-key' // Temporary fallback to test if your env is broken
    )

    setCookie(c, 'session', token, { // 2026 standard cookie config
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return c.json({ 
      success: true, 
      user: { id: user.id, email: user.email } 
    })

  } catch (error) {
    return c.json({ success: false, error: "Authentication transaction crash." }, 500)
  }
})

auth.get('/me', async (c) => {
  // 1. Try Cookie, OR try Authorization Header
  const cookieToken = getCookie(c, 'session');
  const authHeader = c.req.header('Authorization')?.replace('Bearer ', '');
  const token = cookieToken || authHeader;

  if (!token) {
    console.log("No token found in cookie or header.");
    return c.json({ success: false, authenticated: false, error: "No token provided" }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback-local-secret-key', 'HS256')
    console.log("payload" , payload)
    return c.json({ 
      success: true, 
      authenticated: true, 
      user: { id: payload.id, email: payload.email } 
    });
  } catch (error) {
    // THIS LINE IS CRITICAL: It tells you EXACTLY why it failed
    console.error("JWT Verification Error Details:", error); 
    
    return c.json({ 
      success: false, 
      authenticated: false, 
      error: "Session invalid or expired" 
    }, 401);
  }
});
auth.post('/logout', (c) => {
  deleteCookie(c, 'session') 
  return c.json({ success: true, message: "Logged out cleanly." })
})

export default auth