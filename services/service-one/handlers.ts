import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { router } from "./src/router";
import { preSignUpTriggerHandler } from "./src/triggerHandlers/preSignUp";
import { createContext } from "./src/utils/trpc";

/**
 * Main Handler
 */
export const main = awsLambdaRequestHandler({
  router,
  createContext,
});

/**
 * Trigger Handlers
 */
export const preSignUp = preSignUpTriggerHandler;
