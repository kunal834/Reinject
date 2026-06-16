import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth' // Ensure this extracts user from JWT

// Variables type definition passes user profile into the execution context
const dashboard = new Hono<{ Bindings: Env; Variables: { user: { id: string; email: string } } }>()

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

dashboard.get('/surveys/:id/responses', async (c) => {
  const surveyId = c.req.param('id')
  const user = c.get('user')

  try {
    // Ownership Guard Check: Validate request actor matches record owner definition
    const survey = await c.env.DB.prepare("SELECT owner_id FROM surveys WHERE id = ?")
      .bind(surveyId)
      .first<{ owner_id: string }>()

    if (!survey || survey.owner_id !== user.id) {
      return c.json({ success: false, error: "Access denied or document missing." }, 403)
    }

    // Pull full matching response sequence lines
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM responses WHERE survey_id = ? ORDER BY created_at DESC"
    )
      .bind(surveyId)
      .all()

    // Cleanly parse payload answer blocks back into usable arrays/objects
    const formattedResponses = results.map(resp => ({
      ...resp,
      answers: JSON.parse((resp.answers as string) || '{}')
    }))

    return c.json({ success: true, responses: formattedResponses })
  } catch (error) {
    return c.json({ success: false, error: 'Database pipeline read transaction failure.' }, 500)
  }
})


// Survey creation route 
dashboard.post('/build', async (c) => {
  const { title, questions, branding } = await c.req.json()
  const user = c.get('user')
  console.log("user" , user)
  if (!title || !questions || !Array.isArray(questions)) {
    return c.json({ success: false, error: 'Invalid survey schema payload.' }, 400)
  }

  try {
    // 1. Generate IDs before database operations
    const surveyId = crypto.randomUUID()
    
    // 2. Prepare the Survey Insert
    const surveyStmt = c.env.DB.prepare(
      "INSERT INTO surveys (id, owner_id, title, branding) VALUES (?, ?, ?, ?)"
    ).bind(surveyId, user.id, title, JSON.stringify(branding))

    // 3. Prepare the Question Inserts
    // We map the questions array to a list of statements
    const questionStmts = questions.map((q, index) => {
      return c.env.DB.prepare(
        "INSERT INTO questions (id, survey_id, type, label, options, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(
        crypto.randomUUID(), // New UUID for each question
        surveyId,            // Foreign Key link
        q.type, 
        q.label, 
        JSON.stringify(q.options || []), 
        index                // sort_order
      )
    })

    // 4. Execute all queries as a single Batch (Transaction)
    await c.env.DB.batch([surveyStmt, ...questionStmts])

    return c.json({ success: true, surveyId: surveyId })

  } catch (error) {
    console.error('Survey creation failed:', error)
    return c.json({ success: false, error: 'Failed to create survey record.' }, 500)
  }
})

// querying all the questions from surveys from questions table 
dashboard.get('/list', async (c) => {
  const user = c.get('user')

  try {
    // This query selects the survey details AND grabs all matching questions grouped as a JSON array
    const { results } = await c.env.DB.prepare(`
      SELECT 
        s.*,
        (
          SELECT COUNT(*) 
          FROM questions q 
          WHERE q.survey_id = s.id
        ) as questions_count,
        (
          SELECT COUNT(*) 
          FROM responses r 
          WHERE r.survey_id = s.id
        ) as responses_count,
        (
          SELECT json_group_array(
            json_object(
              'id', q.id,
              'type', q.type,
              'label', q.label,
              'options', q.options
            )
          )
          FROM questions q
          WHERE q.survey_id = s.id
          ORDER BY q.sort_order ASC
        ) as questions
      FROM surveys s
      WHERE s.owner_id = ?
      ORDER BY s.created_at DESC
    `).bind(user.id).all()

    // D1 returns subquery strings as raw text strings sometimes, 
    // so we parse the questions field back into objects for the frontend
    const sanitizedSurveys = results.map((survey: any) => ({
      ...survey,
      questions: typeof survey.questions === 'string' ? JSON.parse(survey.questions) : (survey.questions || [])
    }))

    return c.json({ success: true, surveys: sanitizedSurveys })

  } catch (error) {
    console.error('Failed to fetch surveys:', error)
    return c.json({ success: false, error: 'Database fetch failed' }, 500)
  }
})
export default dashboard
