import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth' // Ensure this extracts user from JWT
import {responses, surveylist , createSurvey } from '../../handlers/survey.handler'

import  type { logininput} from '../validators/validator'


// Variables type definition passes user profile into the execution context
const dashboard = new Hono<{ Bindings: Env; Variables: { user: logininput } }>()

// variable tells us what we want to get from  the middleware and pass it to the context of the route handler

// Enforce auth middleware guard for all dashboard routes here
dashboard.use('*', authMiddleware)

// below endpoint just for testing purpose if surveys are getting created or not
// dashboard.get('/surveys', async (c) => {
//   const user = c.get('user')

//   try {
//     const query = `
//       SELECT s.*,
//         (SELECT COUNT(*) FROM questions q WHERE q.survey_id = s.id) as questions_count,
//         (SELECT COUNT(*) FROM responses r WHERE r.survey_id = s.id) as responses_count
//       FROM surveys s
//       WHERE s.owner_id = ?
//       ORDER BY s.created_at DESC
//     `
//     const { results } = await c.env.DB.prepare(query)
//       .bind(user.id)
//       .all()

//       console.log("Raw survey results from DB:", results) // Debug log to check raw survey data
//     // Parse branding JSON strings cleanly before dispatching to client
//     const formattedSurveys = results.map(survey => ({
//       ...survey,
//       branding: JSON.parse((survey.branding as string) || '{}')
//     }))

//     return c.json({ success: true, surveys: formattedSurveys })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to aggregate workspace profiles.' }, 500)
//   }
// })

dashboard.get('/surveys/:id/responses' , responses) // Route to fetch all responses for a specific survey
// Survey creation route
dashboard.post('/build', createSurvey) // Route to create a new survey
// querying all the questions from surveys from questions table
dashboard.get('/list', surveylist)
export default dashboard
