import type { SiteRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForSite } from "@sst-app/trpc-mux";
import { createTRPCClient, createTRPCReact } from "@trpc/react";
import superjson from "superjson";

import { useAuthStore } from "../hooks/stores/useAuthStore";

export const trpc = createTRPCReact<SiteRouter>();

export const trpcClient = createTRPCClient<SiteRouter>({
  links: [createMuxLinkForSite(import.meta.env.VITE_API_URL)],
  transformer: superjson,
  headers() {
    const auth = useAuthStore.getState();

    return {
      Authorization: `Bearer ${auth.accessToken}`,
    };
  },
});
