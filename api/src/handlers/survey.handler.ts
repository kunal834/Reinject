import type { Context } from 'hono'
import { surveySchema, responseOutputSchema } from '../validators/validator'
import type { JWTPayload } from '../validators/validator'
import {findsurveyresponses, getSurvey , Createsurveywithquestions ,getsurveywithquestions , Deleteallsurvey}  from '../db/survey.repo'
// Type definition for the environment variables used in the handler functions
type Env = {
    Bindings: {
        DB: D1Database;
        JWT_SECRET: string;
    },
    Variables: {
        user: JWTPayload
    }
}   


// Handler function to fetch survey responses for a specific survey
export const responses = async (c: Context<Env>) => {
  const surveyId = c.req.param('id')
  const user: JWTPayload    = c.get('user')
  // console.log('user', user)

  try {
    // Ownership Guard Check: Validate request actor matches record owner definition
    const survey = await getSurvey(c.env.DB, surveyId)

    if (!survey || survey.owner_id !== user.id) {
      return c.json({ success: false, error: 'Access denied or document missing.' }, 403)
    }

    // Pull full matching response sequence lines
    const { results } = await findsurveyresponses(c.env.DB, surveyId)



 

    // Cleanly parse payload answer blocks back into usable arrays/objects
    const formattedResponses = results.map((resp) => ({
      ...resp,
      answers: JSON.parse((resp.answers as string) || '{}'),
    }))


    const validation = responseOutputSchema.safeParse(formattedResponses)
    console.log('Validation Result:', validation) // Log the validation result for debugging
    if (!validation.success) {
      return c.json({ success: false, error: 'Response output schema validation failed.' }, 500)
    }
    return c.json({ success: true, responses: validation.data } , 200)
  } catch (error) {
    return c.json({ success: false, error: 'Database pipeline read transaction failure.' }, 500)
  }
}



export const createSurvey = async (c: Context<Env>) => {
  const user = c.get('user')as JWTPayload
  console.log('user', user.id)
  const validation = surveySchema.safeParse(await c.req.json())
   
 
  if (!validation.success) {
    return c.json({ success: false, error: 'Invalid survey schema payload.' }, 400)
  }

  const { title, questions, branding } = validation.data


  try {  
    const surveyId = crypto.randomUUID()
    // const surveyStmt = await Insertsurveydata(c.env.DB, surveyId, user.id, title, JSON.stringify(branding))

    // const questionStmts = questions.map((q, index) => {
    //     return Insertquestiondata(c.env.DB, crypto.randomUUID(), surveyId, q.type, q.label, JSON.stringify(q.options || []), index)

    // })

    
    // await c.env.DB.batch([surveyStmt, ...questionStmts])

    await Createsurveywithquestions(c.env.DB, surveyId, user.id, title, JSON.stringify(branding), questions)

    return c.json({ success: true, surveyId: surveyId })
  } catch (error) {
    console.error('Survey creation failed:', error)
    
    return c.json({ success: false, error: 'Failed to create survey record.' }, 500)
  }
}

export const surveylist =  async (c : Context<Env>) => {
  const user:JWTPayload = c.get('user')
     
  try {
    // This query selects the survey details AND grabs all matching questions grouped as a JSON array
    const { results } = await getsurveywithquestions(c.env.DB, user.id)

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


export const deleteSurvey = async (c: Context<Env>) => {
  const surveyId = c.req.param('id')

  const user: JWTPayload = c.get('user')

  if(!surveyId) {
    return c.json({ success: false, error: 'Survey ID is required.' }, 400)
  }
 
  try {
    // Ownership Guard Check: Validate request actor matches record owner definition
    const survey = await getSurvey(c.env.DB, surveyId)

    if (!survey || survey.owner_id !== user.id) {
      return c.json({ success: false, error: 'Access denied or document missing.' }, 403)
    }

      await c.env.DB.prepare('DELETE FROM surveys WHERE id = ? AND owner_id = ?')
          .bind(surveyId, user.id)
          .run()
        
          console.log(`Survey with ID ${surveyId} deleted successfully for user ${user.id}.`)
      return c.json({ success: true, message: 'Survey deleted successfully.' })
  } catch (error) {
    console.error('Survey deletion failed:', error)
    return c.json({ success: false, error: 'Failed to delete survey record.' }, 500)
  }
}


export const deleteallsurveys = async (c: Context<Env>) => {
  const user: JWTPayload = c.get('user')
  
  try {
    await Deleteallsurvey(c.env.DB, user.id)

    console.log(`All surveys deleted successfully for user ${user.id}.`)
    return c.json({ success: true, message: 'All surveys deleted successfully.' })
  } catch (error) {
    console.error('Failed to delete all surveys:', error)
    return c.json({ success: false, error: 'Failed to delete all survey records.' }, 500)
  }
} 