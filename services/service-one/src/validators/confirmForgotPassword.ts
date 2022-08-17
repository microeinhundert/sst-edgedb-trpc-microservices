import { MIN_PASSWORD_LENGTH_LAX } from "@sst-app/common";
import { z } from "zod";

export const confirmForgotPasswordInputSchema = z
  .object({
    email: z.string().email(),
    confirmationCode: z.string().length(6),
    password: z.string().min(MIN_PASSWORD_LENGTH_LAX),
    passwordConfirmation: z.string().min(MIN_PASSWORD_LENGTH_LAX),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type ConfirmForgotPasswordInput = z.infer<typeof confirmForgotPasswordInputSchema>;
