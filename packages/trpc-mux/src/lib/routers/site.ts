import { router as authRouter } from "@sst-app/auth";
import { t } from "@sst-app/trpc";

/**
 * The router for the `site` app.
 */
const router = t.router({
  auth: authRouter,
});

export type Router = typeof router;
