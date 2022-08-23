import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { confirmForgotPasswordInputSchema } from "../../validators/confirmForgotPassword";

/**
 * Confirm Forgot Password
 */
export const confirmForgotPassword = t.procedure
  .input(confirmForgotPasswordInputSchema)
  .mutation(async ({ input, ctx }) => {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
      Password: input.password,
    });

    await ctx.auth.send(command);
  });
