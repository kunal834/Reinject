
import type { Context } from 'hono'
import { responsesSchema } from '../validators/validator'
import {findsurveybyid , findquestionsbysurveyid , insertSurveyResponse} from '../db/app.repo'

type Env = {
    Bindings:
    {
        DB: D1Database
    }
}
export const getpublicSurvey = async (c: Context<Env>) => {
  const surveyId = c.req.param('id')
  console.log('Received request for survey form layout with ID:', surveyId) 

  try {
    // Fetch parent survey record details
    const survey = await findsurveybyid(c, surveyId)
    if (!survey) {
      return c.json({ success: false, error: 'Survey form layout not found.' }, 404)
    }

    // Fetch related layout question entries
    const results = await findquestionsbysurveyid(c, surveyId)

    console.log('Fetched questions for survey form layout:', results) // Debugging line to check the fetched questions
    // Format serialized string entries back to JSON elements
    const formattedQuestions = results.map((q) => ({
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
}

export const submitSurveyResponse = async (c : Context<Env>) => {
  const surveyId = c.req.param('id')

  try {
    const validation = responsesSchema.safeParse(await c.req.json())

    if (!validation.success) {
      return c.json({ success: false, error: 'Invalid answers payload schema format.' }, 400)
    }

    const { answers } = validation.data
    const responseId = crypto.randomUUID()

    await insertSurveyResponse(c, responseId, surveyId, JSON.stringify(answers))

    return c.json({ success: true, message: 'Response payload committed successfully.' }, 201)
  } catch (error) {
    return c.json({ success: false, error: 'Failed to record response payload row.' }, 500)
  }
}
