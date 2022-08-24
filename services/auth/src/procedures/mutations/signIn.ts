import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { signInInputSchema } from "../../validators/signIn";

/**
 * Sign In
 */
export const signIn = t.procedure.input(signInInputSchema).mutation(async ({ input, ctx }) => {
  const cognitoAuth = new CognitoAuth(ctx);

  const credentials = await cognitoAuth.signIn(input);

  return credentials;
});
