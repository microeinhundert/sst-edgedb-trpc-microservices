import { createMuxLinkForSite } from "@sst-app/trpc-mux";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";

import { env } from "~/env";

export const trpcProxyClient = createTRPCProxyClient({
  links: [createMuxLinkForSite(env.API_URL)],
  transformer: superjson,
});
