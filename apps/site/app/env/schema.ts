import { z } from "zod";

/**
 * Specify your apps environment variables schema here.
 */
export const schema = z.object({
  API_URL: z.string(),
  REGION: z.string(),
  DOMAIN_NAME: z.string(),
  SESSION_SECRET: z.string(),
  AUTH_USER_POOL_ID: z.string(),
  AUTH_USER_POOL_CLIENT_ID: z.string(),
  AUTH_BASE_URL: z.string(),
});
