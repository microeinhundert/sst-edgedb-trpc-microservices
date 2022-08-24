import { TRUSTED_EMAIL_DOMAINS } from "@sst-app/common";
import { client, e } from "@sst-app/edgedb";
import type { PreSignUpTriggerHandler } from "aws-lambda";

/**
 * Main Handler
 */
export const main: PreSignUpTriggerHandler = async (event) => {
  const { email, given_name, family_name } = event.request.userAttributes;

  await e
    .insert(e.User, {
      email: e.str(email),
      given_name: e.str(given_name),
      family_name: e.str(family_name),
    })
    .run(client);

  // Automatically confirm users who are using
  // one of the trusted email domains
  event.response.autoConfirmUser = TRUSTED_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));

  return event;
};
