import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { forgotPasswordInputSchema } from "../../validators/forgotPassword";

/**
 * Forgot Password
 */
export const forgotPassword = t.procedure
  .input(forgotPasswordInputSchema)
  .mutation(async ({ input, ctx }) => {
    const cognitoAuth = new CognitoAuth(ctx);

    return cognitoAuth.forgotPassword(input);
  });
