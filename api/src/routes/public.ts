// API endpoints for public routes
import { Hono } from 'hono'
import { getpublicSurvey , submitSurveyResponse} from '../handlers/public.handler'

import z  from 'zod'

const publicApi = new Hono<{ Bindings: Env }>()

publicApi.get('/survey/:id', getpublicSurvey) // Route to fetch public survey form layout by ID

publicApi.post('/survey/:id/respond',  submitSurveyResponse )

export default publicApi
