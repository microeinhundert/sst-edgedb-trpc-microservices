import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { t } from "@sst-app/trpc";

import { signUpInputSchema } from "../../validators/signUp";

/**
 * Sign Up
 */
export const signUp = t.procedure.input(signUpInputSchema).mutation(async ({ input, ctx }) => {
  const command = new SignUpCommand({
    ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
    Username: input.email,
    Password: input.password,
    UserAttributes: [
      {
        Name: "given_name",
        Value: input.givenName,
      },
      {
        Name: "family_name",
        Value: input.familyName,
      },
    ],
  });

  const commandOutput = await ctx.auth.send(command);

  return { confirmationNeeded: !!commandOutput.CodeDeliveryDetails };
});
