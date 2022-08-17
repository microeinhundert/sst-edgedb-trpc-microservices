import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { router } from "./src/router";
import { createContext } from "./src/utils/trpc";

export const main = awsLambdaRequestHandler({
  router,
  createContext,
});
