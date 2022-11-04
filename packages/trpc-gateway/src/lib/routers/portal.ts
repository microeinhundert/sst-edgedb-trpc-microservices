import { router as demoRouter } from "@sst-app/demo";
import { createRouter } from "@sst-app/trpc";

/**
 * The router for the `portal` app.
 */
const portalRouter = createRouter({
  demo: demoRouter,
});

export type PortalRouter = typeof portalRouter;
