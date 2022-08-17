import { ConfirmSignUpCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "@sst-app/lambda-env";
import * as trpc from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./utils/trpc";
import { confirmSignUpInputSchema } from "./validators/confirmSignUp";
import { signInInputSchema } from "./validators/signIn";
import { signUpInputSchema } from "./validators/signUp";

export const router = trpc
  .router<Context>()
  .transformer(superjson)

  /**
   * Sign Up
   */
  .mutation("signUp", {
    input: signUpInputSchema,
    async resolve({ input, ctx }) {
      const signUpOutput = await ctx.auth.send(
        new SignUpCommand({
          ClientId: env.USER_POOL_CLIENT_ID,
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
        })
      );

      return signUpOutput;
    },
  })

  /**
   * Confirm Sign Up
   */
  .mutation("confirmSignUp", {
    input: confirmSignUpInputSchema,
    async resolve({ input, ctx }) {
      const confirmSignUpOutput = await ctx.auth.send(
        new ConfirmSignUpCommand({
          ClientId: env.USER_POOL_CLIENT_ID,
          Username: input.email,
          ConfirmationCode: input.confirmationCode,
        })
      );

      return confirmSignUpOutput;
    },
  })

  /**
   * Sign In
   */
  .mutation("signIn", {
    input: signInInputSchema,
    async resolve() {
      return {};
    },
  })

  /**
   * Sign Out
   */
  .mutation("signOut", {
    async resolve() {
      return {};
    },
  });

export type Router = typeof router;
