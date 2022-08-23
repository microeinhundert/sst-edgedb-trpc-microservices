import { createMuxLinkForServices } from "../createMuxLinkForServices";
import type { AdminRouter } from "../routers/admin";

/**
 * Creates the tRPC mux link for the `admin` app.
 */
export function createMuxLinkForAdmin(baseUrl: string) {
  return createMuxLinkForServices<AdminRouter>({
    auth: `${baseUrl}auth`,
  });
}
