import { TRUSTED_EMAIL_DOMAINS } from "@sst-app/common";
import type { PreSignUpTriggerHandler } from "aws-lambda";

/**
 * Main Handler
 */
export const main: PreSignUpTriggerHandler = async (event) => {
  // TODO: Create user in EdgeDB

  // Automatically confirm users who are using
  // one of the trusted email domains
  event.response.autoConfirmUser = TRUSTED_EMAIL_DOMAINS.some((domain) =>
    event.request.userAttributes.email.endsWith(domain)
  );

  return event;
};
