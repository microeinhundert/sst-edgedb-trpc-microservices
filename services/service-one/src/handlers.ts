import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { router } from "./lib/router";
import { createContext } from "./lib/utils/trpc";

export const main = awsLambdaRequestHandler({
  router,
  createContext,
});
