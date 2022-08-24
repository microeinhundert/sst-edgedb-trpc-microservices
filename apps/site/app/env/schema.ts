import { z } from "zod";

/**
 * Specify your apps environment variables schema here.
 */
export const schema = z.object({
  API_URL: z.string(),
});
