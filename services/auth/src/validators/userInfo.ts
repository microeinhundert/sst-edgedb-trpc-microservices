import { z } from "zod";

export const userInfoInputSchema = z.object({
  accessToken: z.string().min(1),
});

export const userInfoOutputSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(1),
});

export type UserInfoInput = z.infer<typeof userInfoInputSchema>;
export type UserInfoOutput = z.infer<typeof userInfoOutputSchema>;
