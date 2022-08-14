import { ConfirmSignUpCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "@sst-app/lambda-env";
import * as trpc from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

import type { Context } from "./utils/trpc";

export const router = trpc
  .router<Context>()
  .transformer(superjson)
  .query("greet", {
    input: z.string(),
    async resolve({ input }) {
      return { id: input, message: `Hello from service one` };
    },
  })
  .mutation("signUp", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
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
  .mutation("confirmSignUp", {
    input: z.object({
      email: z.string().email(),
      confirmationCode: z.string().length(6),
    }),
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
  .mutation("signIn", {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    async resolve() {
      return {};
    },
  })
  .mutation("signOut", {
    async resolve() {
      return {};
    },
  });

export type Router = typeof router;
