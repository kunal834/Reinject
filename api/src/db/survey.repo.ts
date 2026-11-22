
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
    throw new Error('Repository error while finding survey responses'); // Rethrow the error to be handled by the caller
 }
}


export const Insertsurveydata = (db: D1Database, surveyId: string, ownerId: string, title: string, branding: string) => {{
    try {
      return db.prepare(
      'INSERT INTO surveys (id, owner_id, title, branding) VALUES (?, ?, ?, ?)',
    ).bind(surveyId, ownerId, title, branding)

    }catch(err)
    {
        console.error('Error in createSurvey:', err)
        throw new Error('Repositery error while creating survey'); // Rethrow the error to be handled by the caller
    }
}
}

export const Insertquestiondata =  (db: D1Database, questionId: string, surveyId: string, type: string, label: string, options: string [], sortOrder: number) => 
{
 
    return  db.prepare(
        'INSERT INTO questions (id, survey_id, type, label, options, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      ).bind(
        questionId, // New UUID for each question
        surveyId, // Foreign Key link
        type ,
        label  ,
        JSON.stringify(options ?? []),
        sortOrder // sort_order
      )
}

export const getsurveywithquestions = async (db: D1Database, UserId: string) => {
   return await db.prepare(`
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
      .bind(UserId)
      .all()
}
export const Createsurveywithquestions = async (db: D1Database, surveyId: string, ownerId: string, title: string, branding: any, questions: any[]) => {
 try{

  const surveyStmt =  Insertsurveydata(db, surveyId, ownerId, title, branding)

  const questionStmts = questions.map((q, index) => {
      return Insertquestiondata(db, crypto.randomUUID(), surveyId, q.type, q.label, q.options || [], index)
  })

  await db.batch([surveyStmt, ...questionStmts])
 }
  catch(err)  
  {
    console.error('Error in Createsurveywithquestions:', err)
    // throw new Error('Repository error while creating survey with questions'); // Rethrow the error to be handled by the caller
    
  }

}


export const Deleteallsurvey =  (db: D1Database,  ownerId: string) => {
  try 
  {
    return db.prepare('DELETE FROM surveys WHERE owner_id = ?')
    .bind(ownerId)
    .run()
  } catch (err) {
    console.error('Error in Deleteallsurvey:', err)
    throw new Error('Repository error while deleting survey'); // Rethrow the error to be handled by the caller
  }
}

export const Deletesurveybyid =  async (db: D1Database,  surveyId: string , userId: string) => {
  try{
    await db.prepare('DELETE FROM surveys WHERE id = ? AND owner_id = ?')
          .bind(surveyId, userId)
          .run()
  }catch(err)
  {
    console.error('Error in Deletesurveybyid:', err)
    throw new Error('Repository error while deleting survey by id'); // Rethrow the error to be handled by the caller
  }

}

export const FindsurveyTitle = async (db: D1Database, ownerId: string, title: string) => {
  try {
    return await db.prepare('SELECT id FROM surveys WHERE owner_id = ? AND title = ?')
      .bind(ownerId, title)
      .first()

  }catch(err)
  {
    console.error('Error in FindsurveyTitle:', err)
    throw new Error('Repository error while finding survey title'); // Rethrow the error to be handled by the caller
  }
}