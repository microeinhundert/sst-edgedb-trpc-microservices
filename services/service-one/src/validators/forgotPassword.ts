import { z } from "zod";

export const forgotPasswordInputSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
