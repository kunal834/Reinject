import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from '../routes/auth'
import publicApi from '../routes/public'
import surveysRouter from '../routes/survey'


const app = new Hono<{ Bindings: Env }>()

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://formflow-app.pages.dev', // Frontend URL
      ]
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[1]
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Base Health Check
app.get('/api/health', (c) => c.json({ status: 'ok' })) // Happy patth
app.route('/api/auth', authRouter)
app.route('/api/surveys', surveysRouter)
app.route('/api/public', publicApi)


// safes response for all other routes
app.all('*', (c) => c.json({ message: 'This page does not exist.' }, 404))


export default app
