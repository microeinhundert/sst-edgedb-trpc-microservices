import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { signOutInputSchema } from "../../validators/signOut";

/**
 * Sign Out
 */
export const signOut = t.procedure.input(signOutInputSchema).mutation(async ({ input, ctx }) => {
  const cognitoAuth = new CognitoAuth(ctx);

  return cognitoAuth.signOut(input);
});
