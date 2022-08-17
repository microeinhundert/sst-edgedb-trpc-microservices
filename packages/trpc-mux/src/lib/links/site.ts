import type { TRPCLink } from "@trpc/client";

import { createMuxLinksForServers } from "../createMuxLinksForServers";
import type { Router } from "../routers/site";

/**
 * Creates tRPC links for the `site` app.
 */
export function createMuxLinks(baseUrl: string): TRPCLink<Router>[] {
  return createMuxLinksForServers({
    auth: `${baseUrl}auth`,
  });
}
