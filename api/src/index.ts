import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from '../routes/auth'       
import surveysRouter from '../routes/survey'
import publicApi from '../routes/public'

const app = new Hono<{ Bindings: Env }>()

// Global CORS config so your React app can safely deliver HttpOnly credentials
app.use('/api/*', async (c, next) => {
  const corsMiddleware = cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
  return corsMiddleware(c, next)
})

// Base Health Check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

// 🔌 Mount Sub-Routers
// This means: Any request to /api/auth/* goes straight to authRouter
app.route('/api/auth', authRouter)
app.route('/api/surveys', surveysRouter)
app.route('/api/public', publicApi);

export default app
