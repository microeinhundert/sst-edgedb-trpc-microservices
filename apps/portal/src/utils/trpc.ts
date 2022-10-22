import type { PortalRouter } from "@sst-app/trpc-mux";
import { createMuxLinkForPortal } from "@sst-app/trpc-mux";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<PortalRouter>();

export const trpcClient = trpc.createClient({
  links: [createMuxLinkForPortal(import.meta.env.VITE_API_URL)],
  transformer: superjson,
});
