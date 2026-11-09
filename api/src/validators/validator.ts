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


export const surveySchema = z.object({
    title: z.string().min(1, 'Survey title is required.'),
    branding: z.record(z.string(), z.unknown()).optional(),
    questions: z.array(z.object({
        type: z.string().min(1, 'Question type is required.'),
        label: z.string().min(1, 'Question label is required.'),
        options: z.array(z.string()).optional(),
        sort_order: z.number().int().optional()
    }))
});

export type surveyinput = z.infer<typeof surveySchema>;

export const responsesSchema = z.object({
    answers: z.record(
        z.string(),
        z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.array(z.string()),
            z.null(),
        ]),
    ),
});


export type responsesinput = z.infer<typeof responsesSchema>;

export const responseOutputSchema = z.array(
  z.object({
    id: z.string(),
    survey_id: z.string(),
    answers: z.record(z.string(), z.unknown()),
    created_at: z.string().nullable().optional(),
  }),
)