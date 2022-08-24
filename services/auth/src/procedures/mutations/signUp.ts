import { t } from "@sst-app/trpc";

import { CognitoAuth } from "../../features/cognitoAuth";
import { signUpInputSchema } from "../../validators/signUp";

/**
 * Sign Up
 */
export const signUp = t.procedure.input(signUpInputSchema).mutation(async ({ input, ctx }) => {
  const cognitoAuth = new CognitoAuth(ctx);

  const { confirmationNeeded } = await cognitoAuth.signUp(input);

  if (confirmationNeeded) {
    return {
      confirmationNeeded: true,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      issuedAt: null,
    };
  }

  const credentials = await cognitoAuth.signIn(input);

  return { confirmationNeeded: false, ...credentials };
});
