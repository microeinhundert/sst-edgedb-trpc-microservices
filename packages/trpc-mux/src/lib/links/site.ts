import { createMuxLinkForServices } from "../createMuxLinkForServices";
import { router } from "../routers/site";

/**
 * Creates the tRPC mux link for the `site` app.
 */
export function createMuxLink(baseUrl: string) {
  return createMuxLinkForServices(
    {
      auth: `${baseUrl}auth`,
    },
    router
  );
}
