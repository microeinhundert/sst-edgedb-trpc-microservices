import { z } from "zod";

/**
 * Specify your lambda environment variables schema here.
 * This way you can ensure the lamdas can't be built with invalid environment variables.
 */
export const schema = z.object({
  REGION: z.string(),

  EDGEDB_DSN_SECRET: z.string(),

  USER_POOL_ID: z.string(),
  USER_POOL_CLIENT_ID: z.string(),
});
