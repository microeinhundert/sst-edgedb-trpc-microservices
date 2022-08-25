import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { confirmSignUpInputSchema } from "../../validators/confirmSignUp";

/**
 * Confirm Sign Up
 */
export const confirmSignUp = t.procedure
  .input(confirmSignUpInputSchema)
  .mutation(async ({ input, ctx }) => {
    const cognitoAuth = new CognitoAuth(ctx);

    return cognitoAuth.confirmSignUp(input);
  });
