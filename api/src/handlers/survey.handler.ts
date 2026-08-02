import  {Context } from 'hono'  
import  type { logininput } from '../validators/validator'
// Type definition for the environment variables used in the handler functions
type Env = {
    Bindings: {
        DB: D1Database;
        JWT_SECRET: string;
    },
    variables: {
        // user will come from middleware and will be available in the context of the route handler
        user: logininput
    }
}   
export const responses = async (c: Context<Env>) => {
  const surveyId = c.req.param('id')
  const user: logininput    = c.get('user')

  try {
    // Ownership Guard Check: Validate request actor matches record owner definition
    const survey = await c.env.DB.prepare('SELECT owner_id FROM surveys WHERE id = ?')
      .bind(surveyId)
      .first<{ owner_id: string }>()

    if (!survey || survey.owner_id !== user.id) {
      return c.json({ success: false, error: 'Access denied or document missing.' }, 403)
    }

    // Pull full matching response sequence lines
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM responses WHERE survey_id = ? ORDER BY created_at DESC',
    )
      .bind(surveyId)
      .all()

    // Cleanly parse payload answer blocks back into usable arrays/objects
    const formattedResponses = results.map((resp) => ({
      ...resp,
      answers: JSON.parse((resp.answers as string) || '{}'),
    }))

    return c.json({ success: true, responses: formattedResponses })
  } catch (error) {
    return c.json({ success: false, error: 'Database pipeline read transaction failure.' }, 500)
  }
}



export const createSurvey = async (c: Context<Env>) => {
  const { title, questions, branding } = await c.req.json()
  const user: loginschema = c.get('user')
  console.log('user', user)
  if (!title || !questions || !Array.isArray(questions)) {
    return c.json({ success: false, error: 'Invalid survey schema payload.' }, 400)
  }

  try {  
    const surveyId = crypto.randomUUID()
    const surveyStmt = c.env.DB.prepare(
      'INSERT INTO surveys (id, owner_id, title, branding) VALUES (?, ?, ?, ?)',
    ).bind(surveyId, user.id, title, JSON.stringify(branding))

    const questionStmts = questions.map((q, index) => {
      return c.env.DB.prepare(
        'INSERT INTO questions (id, survey_id, type, label, options, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      ).bind(
        crypto.randomUUID(), // New UUID for each question
        surveyId, // Foreign Key link
        q.type,
        q.label,
        JSON.stringify(q.options || []),
        index, // sort_order
      )
    })

    
    await c.env.DB.batch([surveyStmt, ...questionStmts])

    return c.json({ success: true, surveyId: surveyId })
  } catch (error) {
    console.error('Survey creation failed:', error)
    return c.json({ success: false, error: 'Failed to create survey record.' }, 500)
  }
}

export const surveylist =  async (c : Context<Env>) => {
  const user: loginschema = c.get('user')

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
    `)
      .bind(user.id)
      .all()

    const sanitizedSurveys = results.map((survey: any) => ({
      ...survey,
      questions:
        typeof survey.questions === 'string'
          ? JSON.parse(survey.questions)
          : survey.questions || [],
    }))

    return c.json({ success: true, surveys: sanitizedSurveys })
  } catch (error) {
    console.error('Failed to fetch surveys:', error)
    return c.json({ success: false, error: 'Database fetch failed' }, 500)
  }
}