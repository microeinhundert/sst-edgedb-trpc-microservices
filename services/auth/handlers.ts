import { createContext } from "@sst-app/trpc";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { router } from "./src/router";

/**
 * Main Handler
 */
export const main = awsLambdaRequestHandler({
  router,
  createContext,
});
