import type { AdminRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForAdmin } from "@sst-app/trpc-mux";
import { createTRPCReact } from "@trpc/react";
import superjson from "superjson";

export const trpc = createTRPCReact<AdminRouter>();

export const trpcClient = trpc.createClient({
  links: [createMuxLinkForAdmin(import.meta.env.VITE_API_URL)],
  transformer: superjson,
});
