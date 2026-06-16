// API endpoints for public routes
import { Hono } from 'hono'


const publicApi = new Hono<{ Bindings: Env }>()

publicApi.get('/survey/:id', async (c) => {
  const surveyId = c.req.param('id')
  console.log('Received request for survey form layout with ID:', surveyId) // Debug log to check incoming survey ID

  try {
    // Fetch parent survey record details
    const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE id = ?')
      .bind(surveyId)
      .first<{ title: string; branding: string }>()

    console.log('Fetched survey form layout record from DB:', survey) // Debug log to check fetched survey record

    if (!survey) {
      return c.json({ success: false, error: 'Survey form layout not found.' }, 404)
    }

    // Fetch related layout question entries ordered by sort order index
    const { results: questions } = await c.env.DB.prepare(
      'SELECT id, type, label, options FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
    )
      .bind(surveyId)
      .all()

    console.log('Fetched questions for survey form layout:', questions)
    // Format serialized string entries back to JSON elements
    const formattedQuestions = questions.map((q) => ({
      ...q,
      options: JSON.parse((q.options as string) || '[]'),
    }))

    return c.json({
      success: true,
      survey: {
        title: survey.title,
        branding: JSON.parse(survey.branding || '{}'),
        questions: formattedQuestions,
      },
    })
  } catch (error) {
    return c.json({ success: false, error: 'Server data transaction failure.' }, 500)
  }
})

publicApi.post('/survey/:id/respond', async (c) => {
  const surveyId = c.req.param('id')

  try {
    const { answers } = await c.req.json()
    console.log('Received response submission for survey ID:', surveyId, 'with answers:', answers) // Debug log to check incoming response payload

    if (!answers || typeof answers !== 'object') {
      return c.json({ success: false, error: 'Invalid answers payload schema format.' }, 400)
    }

    const responseId = crypto.randomUUID()

    // Insert response text blob straight into D1 table records
    await c.env.DB.prepare('INSERT INTO responses (id, survey_id, answers) VALUES (?, ?, ?)')
      .bind(responseId, surveyId, JSON.stringify(answers))
      .run()

    return c.json({ success: true, message: 'Response payload committed successfully.' }, 201)
  } catch (error) {
    return c.json({ success: false, error: 'Failed to record response payload row.' }, 500)
  }
})

export default publicApi
