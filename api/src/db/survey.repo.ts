
export const getSurvey =async (db: D1Database, surveyId: string) => 
{
    try {
    return await db.prepare('SELECT owner_id FROM surveys WHERE id = ?')
      .bind(surveyId)
      .first<{ owner_id: string }>()
    }
    catch(err)
    {
        console.error('Error in getSurvey:', err)
        throw new Error('Repositery error while getting survey'); // Rethrow the error to be handled by the caller
    }
  
}

export const findsurveyresponses = async (db: D1Database, surveyId: string) => {
 try
 {
    return await db.prepare(
      'SELECT * FROM responses WHERE survey_id = ? ORDER BY created_at DESC',
    )
      .bind(surveyId)
      .all()
 }catch(err)
 {
    console.error('Error in findsurveyresponses:', err)
    throw new Error('Repositery error while finding survey responses'); // Rethrow the error to be handled by the caller
 }
}


export const Insertsurveydata = async (db: D1Database, surveyId: string, ownerId: string, title: string, branding: string) => {{
    try {
      return await db.prepare(
      'INSERT INTO surveys (id, owner_id, title, branding) VALUES (?, ?, ?, ?)',
    ).bind(surveyId, ownerId, title, JSON.stringify(branding))

    }catch(err)
    {
        console.error('Error in createSurvey:', err)
        throw new Error('Repositery error while creating survey'); // Rethrow the error to be handled by the caller
    }
}