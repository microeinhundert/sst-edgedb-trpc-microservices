import { ConfirmSignUpCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "@sst-app/lambda-env";
import {
  confirmSignUpInputSchema,
  greetInputSchema,
  signInInputSchema,
  signUpInputSchema,
} from "@sst-app/service-one-validators";
import * as trpc from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./utils/trpc";

export const router = trpc
  .router<Context>()
  .transformer(superjson)

  /**
   * Greet
   */
  .query("greet", {
    input: greetInputSchema,
    async resolve({ input }) {
      return { id: input, message: "Hello from service one" };
    },
  })

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
              Value: input.firstName,
            },
            {
              Name: "family_name",
              Value: input.lastName,
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
