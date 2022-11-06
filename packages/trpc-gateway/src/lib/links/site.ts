import { createGatewayLink } from "../createGatewayLink";
import type { SiteRouter } from "../routers/site";

/**
 * Creates the tRPC gateway link for the `site` app.
 */
export function createSiteGatewayLink(baseUrl: string) {
  return createGatewayLink<SiteRouter>({
    auth: `${baseUrl}auth`,
    demo: `${baseUrl}demo`,
  });
}
