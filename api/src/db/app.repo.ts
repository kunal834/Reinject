//  repostery lauyer of our app 
// auth repo lesyer 
import {Context } from "hono";


type Env = {
  // in Hono we declare all the variables and binding here so that we can use in all the function in this  handler functios 
  

  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  }
}

export const finduserbyemail = async (c: Context<Env>, email: string) =>
{ 
    try{
    const value = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?') // we will not use email variable directly in query to prevent SQL injection
      .bind(email)
      .first<{ id: string; email: string; password_hash: string }>()
      console.log('value from finduserbyemail', value) // Debugging line to check the value returned from the database
    return value
    
    }catch (error) {
        console.error('Error in finduserbyemail:', error)
        throw new Error('Repositery error'); // Rethrow the error to be handled by the caller
    }
 

}

export const insertuser = async (c: Context<Env>, name: string, email: string, password_hash: string) =>
{
    try
    {
    const value = await c.env.DB.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), name, email, password_hash) // In a real application, you should hash the password before storing it
      .run()
      console.log('value from finduserbyemail', value) 
      return value;
    }catch(err)
    {
        console.error('Error in insertuser:', err)
        throw new Error('Repositery error while inserting user'); // Rethrow the error to be handled by the caller
    }


}

export const findsurveybyid = async (c: Context<Env>, surveyId: string) =>
{
    try{
        const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE id = ?')
      .bind(surveyId)
      .first<{ title: string; branding: string }>()
        
      return survey;
    }catch(err)
    {
        console.error('Error in findsurveybyid:', err)
        throw new Error('Repositery error while finding survey by id'); // Rethrow the error to be handled by the caller
    }
}



export const findquestionsbysurveyid = async (c: Context<Env>, surveyId: string) =>
{
// Look at the object returned by .all(), find the property named results, extract it, and save it into a brand new local variable named questions   
// Fetch related layout question entries ordered by sort order index
    const { results: questions } = await c.env.DB.prepare(
      'SELECT id, type, label, options FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
    )
      .bind(surveyId)
      .all()


      return questions;
}



export const insertSurveyResponse = async (c: Context<Env>, responseId: string, surveyId: string, answers: any) =>
{
    try 
    {
  // Insert response text blob straight into D1 table records
    await c.env.DB.prepare('INSERT INTO responses (id, survey_id, answers) VALUES (?, ?, ?)')
      .bind(responseId, surveyId, JSON.stringify(answers))
      .run()
    }catch(err)
    {
        console.error('Error in insertSurveyResponse:', err)
        throw new Error('Repositery error while inserting survey response'); // Rethrow the error to be handled by the caller
    }
}