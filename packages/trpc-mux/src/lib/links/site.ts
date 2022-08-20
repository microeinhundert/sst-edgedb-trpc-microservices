import { createMuxLinkForServices } from "../createMuxLinkForServices";
import type { Router } from "../routers/site";

/**
 * Creates the tRPC mux link for the `site` app.
 */
export function createMuxLink(baseUrl: string) {
  return createMuxLinkForServices<Router>({
    auth: `${baseUrl}auth`,
  });
}
