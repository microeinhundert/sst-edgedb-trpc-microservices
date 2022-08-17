import { MIN_PASSWORD_LENGTH_LAX } from "@sst-app/common";
import { z } from "zod";

export const signUpInputSchema = z
  .object({
    givenName: z.string().min(1),
    familyName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH_LAX),
    passwordConfirmation: z.string().min(MIN_PASSWORD_LENGTH_LAX),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type SignUpInput = z.infer<typeof signUpInputSchema>;
