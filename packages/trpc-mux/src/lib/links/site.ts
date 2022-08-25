import { createMuxLinkForServices } from "../createMuxLinkForServices";
import type { SiteRouter } from "../routers/site";

/**
 * Creates the tRPC mux link for the `site` app.
 */
export function createMuxLinkForSite(baseUrl: string) {
  return createMuxLinkForServices<SiteRouter>({
    auth: `${baseUrl}auth`,
    demo: `${baseUrl}demo`,
  });
}
