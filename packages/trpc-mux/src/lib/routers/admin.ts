import { router as authRouter } from "@sst-app/auth";
import { router as demoRouter } from "@sst-app/demo";
import { t } from "@sst-app/trpc";

/**
 * The router for the `admin` app.
 */
const adminRouter = t.router({
  auth: authRouter,
  demo: demoRouter,
});

export type AdminRouter = typeof adminRouter;
