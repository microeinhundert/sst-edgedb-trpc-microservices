import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { forgotPasswordInputSchema } from "../../validators/forgotPassword";

/**
 * Forgot Password
 */
export const forgotPassword = t.procedure
  .input(forgotPasswordInputSchema)
  .mutation(async ({ input, ctx }) => {
    const command = new ForgotPasswordCommand({
      ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
      Username: input.email,
    });

    await ctx.auth.send(command);
  });
