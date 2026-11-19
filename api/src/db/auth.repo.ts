export const finduserbyemail = async (db: D1Database, email: string) =>
{ 
    try{
    const value = await db.prepare('SELECT * FROM users WHERE email = ?') // we will not use email variable directly in query to prevent SQL injection
      .bind(email)
      .first<{ id: string; email: string; password_hash: string }>()
      console.log('value from finduserbyemail', value) // Debugging line to check the value returned from the database
    return value
    
    }catch (error) {
        console.error('Error in finduserbyemail:', error)
        throw new Error('Repositery error'); // Rethrow the error to be handled by the caller
    }
 

}

export const insertuser = async (db: D1Database, id : string, name: string, email: string, password_hash: string) =>
{
    try
    {
    const value = await db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
      .bind(id, name, email, password_hash) // In a real application, you should hash the password before storing it
      .run()
      console.log('value from finduserbyemail', value) 
      return value;
    }catch(err)
    {
        console.error('Error in insertuser:', err)
        throw new Error('Repositery error while inserting user'); // Rethrow the error to be handled by the caller
    }


}
