import type { PreSignUpTriggerHandler } from "aws-lambda";

export const preSignUpTriggerHandler: PreSignUpTriggerHandler = async (event) => {
  console.log(event.request.userAttributes);

  // TODO: Create user in EdgeDB
};