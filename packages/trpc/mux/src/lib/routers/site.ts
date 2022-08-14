import { router as serviceOneRouter } from "@sst-app/service-one";
import * as trpc from "@trpc/server";

/**
 * The router for the `site` app.
 */
export const router = trpc.router<any>().merge("serviceOne.", serviceOneRouter);

export type Router = typeof router;
