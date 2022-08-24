import type { AdminRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForAdmin } from "@sst-app/trpc-mux";
import { createTRPCClient, createTRPCReact } from "@trpc/react";
import superjson from "superjson";

import { useAuthStore } from "../hooks/stores/useAuthStore";

export const trpc = createTRPCReact<AdminRouter>();

export const trpcClient = createTRPCClient<AdminRouter>({
  links: [createMuxLinkForAdmin(import.meta.env.VITE_API_URL)],
  transformer: superjson,
  headers() {
    const auth = useAuthStore.getState();

    return {
      Authorization: `Bearer ${auth.accessToken}`,
    };
  },
});
