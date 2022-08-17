import { z } from "zod";

export const signOutInputSchema = z.object({
  token: z.string().min(1),
});

export type SignOutInput = z.infer<typeof signOutInputSchema>;
