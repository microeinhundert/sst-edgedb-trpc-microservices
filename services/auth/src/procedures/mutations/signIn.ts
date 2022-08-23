import { AuthFlowType, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { signInInputSchema } from "../../validators/signIn";

/**
 * Sign In
 */
export const signIn = t.procedure.input(signInInputSchema).mutation(async ({ input, ctx }) => {
  const command = new InitiateAuthCommand({
    ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: input.email,
      PASSWORD: input.password,
    },
  });

  await ctx.auth.send(command);
});
