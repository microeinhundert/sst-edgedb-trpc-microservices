import type { PreSignUpTriggerHandler } from "aws-lambda";

/**
 * Main Handler
 */
export const main: PreSignUpTriggerHandler = async (event) => {
  console.log(event.request.userAttributes);

  // TODO: Create user in EdgeDB
};
