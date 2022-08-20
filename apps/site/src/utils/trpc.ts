import type { SiteRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForSite } from "@sst-app/trpc-mux";
import { createReactQueryHooks, createTRPCClient } from "@trpc/react";
import superjson from "superjson";

export const trpc = createReactQueryHooks<SiteRouter>();

export const trpcClient = createTRPCClient<SiteRouter>({
  links: [createMuxLinkForSite(import.meta.env.VITE_API_URL)],
  transformer: superjson,
});
