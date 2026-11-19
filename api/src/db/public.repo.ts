export const findsurveybyid = async (db: D1Database, surveyId: string) =>
{
    try{
        const survey = await db.prepare('SELECT * FROM surveys WHERE id = ?')
      .bind(surveyId)
      .first<{ title: string; branding: string }>()
        
      return survey;
    }catch(err)
    {
        console.error('Error in findsurveybyid:', err)
        throw new Error('Repositery error while finding survey by id'); // Rethrow the error to be handled by the caller
    }
}




export const findquestionsbysurveyid = async (db: D1Database, surveyId: string) =>
{
// Look at the object returned by .all(), find the property named results, extract it, and save it into a brand new local variable named questions   
// Fetch related layout question entries ordered by sort order index
    const { results: questions } = await db.prepare(
      'SELECT id, type, label, options FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
    )
      .bind(surveyId)
      .all()


      return questions;
}



export const insertSurveyResponse = async (db: D1Database, responseId: string, surveyId: string, answers: any) =>
{
    try 
    {
  // Insert response text blob straight into D1 table records
    await db.prepare('INSERT INTO responses (id, survey_id, answers) VALUES (?, ?, ?)')
      .bind(responseId, surveyId, JSON.stringify(answers))
      .run()
    }catch(err)
    {
        console.error('Error in insertSurveyResponse:', err)
        throw new Error('Repositery error while inserting survey response'); // Rethrow the error to be handled by the caller
    }
}