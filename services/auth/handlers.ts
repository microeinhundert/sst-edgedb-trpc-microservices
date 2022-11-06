import { awsLambdaRequestHandler, createContext } from "@sst-app/trpc";

import { router } from "./src/router";

/**
 * Main Handler
 */
export const main = awsLambdaRequestHandler({
  router,
  createContext,
});
