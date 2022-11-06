import { z } from "zod";

export const refreshCredentialsInputSchema = z.object({
  redirectUri: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const refreshCredentialsOutputSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().optional(),
  id_token: z.string().min(1),
  expires_in: z.number(),
});

export type RefreshCredentialsInput = z.infer<typeof refreshCredentialsInputSchema>;
export type RefreshCredentialsOutput = z.infer<typeof refreshCredentialsOutputSchema>;
