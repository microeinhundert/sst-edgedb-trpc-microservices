import type { PortalRouter } from "@sst-app/trpc-gateway";
import { createPortalGatewayLink } from "@sst-app/trpc-gateway";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<PortalRouter>();

export const trpcClient = trpc.createClient({
  links: [createPortalGatewayLink(import.meta.env.VITE_API_URL)],
  transformer: superjson,
});
