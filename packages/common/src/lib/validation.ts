import { z } from "zod";

export function isEmail(maybeEmail: unknown) {
  const emailSchema = z.string().email();
  const { success } = emailSchema.safeParse(maybeEmail);

  return success;
}
