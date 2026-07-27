import { z } from 'zod';



export const signupschema = z.object({
    name : z.string().min(1, 'Name is required.'),
    email: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters long.')
});



export const loginschema  = signupschema.omit({name : true});

export type user = z.infer<typeof userSchema>;
