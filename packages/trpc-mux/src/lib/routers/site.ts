import { router as authRouter } from "@sst-app/auth";
import { t } from "@sst-app/trpc";

/**
 * The router for the `site` app.
 */
export const router = t.mergeRouters(authRouter);

export type Router = typeof router;
