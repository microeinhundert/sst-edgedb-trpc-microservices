import { z } from "zod";

export const confirmSignUpInputSchema = z.object({
  email: z.string().email(),
  confirmationCode: z.string().length(6),
});

export type ConfirmSignUpInput = z.infer<typeof confirmSignUpInputSchema>;
