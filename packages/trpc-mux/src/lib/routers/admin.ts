import { router as authRouter } from "@sst-app/auth";
import { t } from "@sst-app/trpc";

/**
 * The router for the `admin` app.
 */
const adminRouter = t.mergeRouters(authRouter);

export type AdminRouter = typeof adminRouter;
