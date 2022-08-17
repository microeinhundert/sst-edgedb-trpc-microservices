import { z } from "zod";

export const signUpInputSchema = z
  .object({
    givenName: z.string().min(1),
    familyName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type SignUpInput = z.infer<typeof signUpInputSchema>;
