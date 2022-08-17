import { router as authRouter } from "@sst-app/auth";
import * as trpc from "@trpc/server";

/**
 * The router for the `site` app.
 */
export const router = trpc.router<any>().merge("auth.", authRouter);

export type Router = typeof router;
