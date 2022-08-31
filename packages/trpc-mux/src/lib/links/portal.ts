import { createMuxLinkForServices } from "../createMuxLinkForServices";
import type { PortalRouter } from "../routers/portal";

/**
 * Creates the tRPC mux link for the `portal` app.
 */
export function createMuxLinkForPortal(baseUrl: string) {
  return createMuxLinkForServices<PortalRouter>({
    demo: `${baseUrl}demo`,
  });
}
