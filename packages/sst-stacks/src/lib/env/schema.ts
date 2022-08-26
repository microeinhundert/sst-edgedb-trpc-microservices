import { z } from "zod";

/**
 * Specify your SST environment variables schema here.
 * This way you can ensure the infrastructure can't be provisioned with invalid environment variables.
 */
export const schema = z.object({
  ROUTE53_ZONE_NAME: z.string(),
  ROUTE53_HOSTED_ZONE_ID: z.string(),

  EDGEDB_INSTANCE_COUNT: z.string(),
  EDGEDB_DOMAIN_NAME: z.string(),

  ADMIN_DOMAIN_NAME: z.string(),
  SITE_DOMAIN_NAME: z.string(),
  API_DOMAIN_NAME: z.string(),
});
