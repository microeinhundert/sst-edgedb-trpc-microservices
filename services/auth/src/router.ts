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
import { t } from "@sst-app/trpc";

import { confirmForgotPasswordInputSchema } from "./validators/confirmForgotPassword";
import { confirmSignUpInputSchema } from "./validators/confirmSignUp";
import { forgotPasswordInputSchema } from "./validators/forgotPassword";
import { signInInputSchema } from "./validators/signIn";
import { signOutInputSchema } from "./validators/signOut";
import { signUpInputSchema } from "./validators/signUp";

export const router = t.router({
  auth: t.router({
    /**
     * Sign Up
     */
    signUp: t.procedure.input(signUpInputSchema).mutation(async ({ input, ctx }) => {
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
    }),

    /**
     * Confirm Sign Up
     */
    confirmSignUp: t.procedure.input(confirmSignUpInputSchema).mutation(async ({ input, ctx }) => {
      const command = new ConfirmSignUpCommand({
        ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
        Username: input.email,
        ConfirmationCode: input.confirmationCode,
      });

      await ctx.auth.send(command);
    }),

    /**
     * Sign In
     */
    signIn: t.procedure.input(signInInputSchema).mutation(async ({ input, ctx }) => {
      const command = new InitiateAuthCommand({
        ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: input.email,
          PASSWORD: input.password,
        },
      });

      await ctx.auth.send(command);
    }),

    /**
     * Sign Out
     */
    signOut: t.procedure.input(signOutInputSchema).mutation(async ({ input, ctx }) => {
      const command = new RevokeTokenCommand({
        ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
        Token: input.token,
      });

      await ctx.auth.send(command);
    }),

    /**
     * Forgot Password
     */
    forgotPassword: t.procedure
      .input(forgotPasswordInputSchema)
      .mutation(async ({ input, ctx }) => {
        const command = new ForgotPasswordCommand({
          ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
          Username: input.email,
        });

        await ctx.auth.send(command);
      }),

    /**
     * Confirm Forgot Password
     */
    confirmForgotPassword: t.procedure
      .input(confirmForgotPasswordInputSchema)
      .mutation(async ({ input, ctx }) => {
        const command = new ConfirmForgotPasswordCommand({
          ClientId: Config.AUTH_USER_POOL_CLIENT_ID,
          Username: input.email,
          ConfirmationCode: input.confirmationCode,
          Password: input.password,
        });

        await ctx.auth.send(command);
      }),
  }),
});
