import { z } from 'zod';



export const signupschema = z.object({
    name : z.string().min(1, 'Name is required.'),
    email: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters long.')
});



export const loginschema  = signupschema.omit({name : true});

// defining an type for middleware to extract user from jwt and pass it to the context of the route handler
export type logininput = z.infer<typeof loginschema>;

// Define a schema for payload validation 
export const payloadschema = z.object({
    id: z.string(),
    email: z.string().email(),
   // Optional claims so Zod won't panic if they are present or missing
  exp: z.number().optional(),
  iat: z.number().optional(),
  })



export type user = z.infer<typeof signupschema>;


