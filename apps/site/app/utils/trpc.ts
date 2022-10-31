import { createSiteGatewayLink } from "@sst-app/trpc-gateway";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";

import { env } from "~/env";

export const trpcProxyClient = createTRPCProxyClient({
  links: [createSiteGatewayLink(env.API_URL)],
  transformer: superjson,
});
