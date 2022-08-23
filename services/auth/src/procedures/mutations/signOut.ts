import { RevokeTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { signOutInputSchema } from "../../validators/signOut";

/**
 * Sign Out
 */
export const signOut = t.procedure.input(signOutInputSchema).mutation(async ({ input, ctx }) => {
  const command = new RevokeTokenCommand({
    ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
    Token: input.token,
  });

  await ctx.auth.send(command);
});
