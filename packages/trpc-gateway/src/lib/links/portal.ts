import { createGatewayLink } from "../createGatewayLink";
import type { PortalRouter } from "../routers/portal";

/**
 * Creates the tRPC gateway link for the `portal` app.
 */
export function createPortalGatewayLink(baseUrl: string) {
  return createGatewayLink<PortalRouter>({
    demo: `${baseUrl}demo`,
  });
}
