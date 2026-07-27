import z from "zod"
import { Context, Hono } from 'hono'
import {loginschema , signupschema} from '../validators/validator'
import { sign, verify } from 'hono/jwt'
import { setCookie } from 'hono/cookie'



type Env = {
    Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  }
}

export const login = async (c : Context<Env>) => {
 
 try {
    const body = await c.req.json();
    console.log('Request Body:', body); // Log the entire request body for debugging
    const validation = loginschema.safeParse(body);
    console.log('Validation Result:', validation); // Log the validation result for debugging
   
    if (!validation.success) {
        return c.json(
            {
                success: false,
                error: validation.error.issues[0].message || 'Invalid input data.'
            },
            400 // bad request
        );

    }

    const { email, password } = validation.data;
    // no need to put checks regarding email and password as zod do it forus 

    const cleanEmail = email.toLowerCase().trim()

    let existingUser = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?') // we will not use email variable directly in query to prevent SQL injection
      .bind(cleanEmail)
      .first<{ id: string; email: string }>()

   if (!existingUser) {
  return c.json({ success: false, error: 'Invalid email or password.' }, 400);
}
    // Double check secret exists
    if (!c.env.JWT_SECRET) {
      console.error('CRITICAL: c.env.JWT_SECRET is missing!')
    }

    const token = await sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      c.env.JWT_SECRET || 'fallback-local-secret-key', // Temporary fallback to test if your env is broken
    )

    setCookie(c, 'session', token, {
      // 2026 standard cookie config
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return c.json({
      success: true,
      user: { id: existingUser.id, email: existingUser.email },
    })
  } catch (error) {
    console.error('Login Error Details:', error)
    return c.json({ success: false, error: 'Authentication transaction crash.' }, 500)
  }

}



export const signup = async (c : Context<Env>) => {
 
 try {
    const body = await c.req.json();
    console.log('Request Body:', body); // Log the entire request body for debugging
    const validation = signupschema.safeParse(body);
    console.log('Validation Result:', validation); // Log the validation result for debugging
   
    if (!validation.success) {
        return c.json(
            {
                success: false,
                error: validation.error.issues[0].message || 'Invalid input data.'
            },
            400 // bad request
        );

    }

    const { name , email, password } = validation.data;
    // no need to put checks regarding email and password as zod do it forus
    const cleanEmail = email.toLowerCase().trim()
     const existingUser = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
  .bind(cleanEmail)
  .first<{ id: string; email: string }>()

  if (existingUser) {
    return c.json({ success: false, error: 'Email already exists.' }, 400)
    }


const newUserId = crypto.randomUUID()

await c.env.DB.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
  .bind(newUserId, name, cleanEmail, password) // In a real application, you should hash the password before storing it
  .run()    





    // Double check secret exists
    if (!c.env.JWT_SECRET) {
      console.error('CRITICAL: c.env.JWT_SECRET is missing!')
    }

    const token = await sign(
      {
        id: newUserId,
        email: cleanEmail,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      c.env.JWT_SECRET || 'fallback-local-secret-key', // Temporary fallback to test if your env is broken
    )

    setCookie(c, 'session', token, {
      // 2026 standard cookie config
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return c.json({
      success: true,
      signupUser: { id: newUserId, email: cleanEmail },
    })
  } catch (error) {
    console.error('Signup Error Details:', error)
    return c.json({ success: false, error: 'Authentication transaction crash.' }, 500)
  }

}


