import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { confirmSignUpInputSchema } from "../../validators/confirmSignUp";

/**
 * Confirm Sign Up
 */
export const confirmSignUp = t.procedure
  .input(confirmSignUpInputSchema)
  .mutation(async ({ input, ctx }) => {
    const command = new ConfirmSignUpCommand({
      ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
    });

    await ctx.auth.send(command);
  });
