import {
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  RevokeTokenCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import * as trpc from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./utils/trpc";
import { confirmForgotPasswordInputSchema } from "./validators/confirmForgotPassword";
import { confirmSignUpInputSchema } from "./validators/confirmSignUp";
import { forgotPasswordInputSchema } from "./validators/forgotPassword";
import { signInInputSchema } from "./validators/signIn";
import { signOutInputSchema } from "./validators/signOut";
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
      const command = new SignUpCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
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
    },
  })

  /**
   * Confirm Sign Up
   */
  .mutation("confirmSignUp", {
    input: confirmSignUpInputSchema,
    async resolve({ input, ctx }) {
      const command = new ConfirmSignUpCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
        Username: input.email,
        ConfirmationCode: input.confirmationCode,
      });

      await ctx.auth.send(command);
    },
  })

  /**
   * Sign In
   */
  .mutation("signIn", {
    input: signInInputSchema,
    async resolve({ input, ctx }) {
      const command = new InitiateAuthCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: input.email,
          PASSWORD: input.password,
        },
      });

      await ctx.auth.send(command);
    },
  })

  /**
   * Sign Out
   */
  .mutation("signOut", {
    input: signOutInputSchema,
    async resolve({ input, ctx }) {
      const command = new RevokeTokenCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
        Token: input.token,
      });

      await ctx.auth.send(command);
    },
  })

  /**
   * Forgot Password
   */
  .mutation("forgotPassword", {
    input: forgotPasswordInputSchema,
    async resolve({ input, ctx }) {
      const command = new ForgotPasswordCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
        Username: input.email,
      });

      await ctx.auth.send(command);
    },
  })

  /**
   * Confirm Forgot Password
   */
  .mutation("confirmForgotPassword", {
    input: confirmForgotPasswordInputSchema,
    async resolve({ input, ctx }) {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: Config.USER_POOL_CLIENT_ID,
        Username: input.email,
        ConfirmationCode: input.confirmationCode,
        Password: input.password,
      });

      await ctx.auth.send(command);
    },
  });

export type Router = typeof router;
