import { router as authRouter } from "@sst-app/auth";
import { router as demoRouter } from "@sst-app/demo";
import { createRouter } from "@sst-app/trpc";

/**
 * The router for the `site` app.
 */
const siteRouter = createRouter({
  auth: authRouter,
  demo: demoRouter,
});

export type SiteRouter = typeof siteRouter;
