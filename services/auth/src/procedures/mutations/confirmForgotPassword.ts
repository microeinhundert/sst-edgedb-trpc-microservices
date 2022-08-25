import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { confirmForgotPasswordInputSchema } from "../../validators/confirmForgotPassword";

/**
 * Confirm Forgot Password
 */
export const confirmForgotPassword = t.procedure
  .input(confirmForgotPasswordInputSchema)
  .mutation(async ({ input, ctx }) => {
    const cognitoAuth = new CognitoAuth(ctx);

    return cognitoAuth.confirmForgotPassword(input);
  });
