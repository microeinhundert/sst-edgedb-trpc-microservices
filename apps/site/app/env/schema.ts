import { z } from "zod";

/**
 * Specify your apps environment variables schema here.
 */
export const schema = z.object({
  API_URL: z.string(),
  REGION: z.string(),
  USER_POOL_ID: z.string(),
  USER_POOL_CLIENT_ID: z.string(),
  DOMAIN_NAME: z.string(),
});
