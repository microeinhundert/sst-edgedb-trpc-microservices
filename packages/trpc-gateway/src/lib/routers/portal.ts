import { router as demoRouter } from "@sst-app/demo";
import { t } from "@sst-app/trpc";

/**
 * The router for the `portal` app.
 */
const portalRouter = t.router({
  demo: demoRouter,
});

export type PortalRouter = typeof portalRouter;
