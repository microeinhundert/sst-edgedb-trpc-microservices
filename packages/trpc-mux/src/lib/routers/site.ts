import { router as authRouter } from "@sst-app/auth";
import { t } from "@sst-app/trpc";

/**
 * The router for the `site` app.
 */
const siteRouter = t.router({
  auth: authRouter,
});

export type SiteRouter = typeof siteRouter;
