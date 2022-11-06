import { z } from "zod";

export const issueCredentialsInputSchema = z.object({
  redirectUri: z.string().min(1),
  code: z.string().min(1),
});

export const issueCredentialsOutputSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  id_token: z.string().min(1),
  expires_in: z.number(),
});

export type IssueCredentialsInput = z.infer<typeof issueCredentialsInputSchema>;
export type IssueCredentialsOutput = z.infer<typeof issueCredentialsOutputSchema>;
