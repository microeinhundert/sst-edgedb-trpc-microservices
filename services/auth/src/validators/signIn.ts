import { z } from "zod";

export const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignInInput = z.infer<typeof signInInputSchema>;
