import { createSiteGatewayLink } from "@sst-app/trpc-gateway";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";

import { getGlobalEnvVar } from "./env";

export const trpcClient = createTRPCProxyClient({
  links: [createSiteGatewayLink(getGlobalEnvVar("API_URL"))],
  transformer: superjson,
});
