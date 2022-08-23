import type { SiteRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForSite } from "@sst-app/trpc-mux";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";

export const trpcClient = createTRPCClient<SiteRouter>({
  links: [createMuxLinkForSite(process.env.API_URL)],
  transformer: superjson,
});
