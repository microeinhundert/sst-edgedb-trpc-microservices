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
import type { Context } from "@sst-app/trpc";

import type { ConfirmForgotPasswordInput } from "../validators/confirmForgotPassword";
import type { ConfirmSignUpInput } from "../validators/confirmSignUp";
import type { ForgotPasswordInput } from "../validators/forgotPassword";
import type { SignInInput } from "../validators/signIn";
import type { SignOutInput } from "../validators/signOut";
import type { SignUpInput } from "../validators/signUp";

const CLIENT_ID = Config.COGNITO_USER_POOL_CLIENT_ID;

export class CognitoAuth {
  constructor(private _ctx: Context) {}

  public async forgotPassword(input: ForgotPasswordInput) {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: input.email,
    });

    const { CodeDeliveryDetails } = await this._ctx.auth.send(command);

    return {
      confirmationNeeded: !!CodeDeliveryDetails,
    };
  }

  public async confirmForgotPassword(input: ConfirmForgotPasswordInput) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
      Password: input.password,
    });

    await this._ctx.auth.send(command);

    return {};
  }

  public async signIn(input: SignInInput) {
    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: input.email,
        PASSWORD: input.password,
      },
    });

    const { AuthenticationResult } = await this._ctx.auth.send(command);

    return {
      accessToken: AuthenticationResult!.AccessToken!,
      refreshToken: AuthenticationResult!.RefreshToken!,
      expiresIn: AuthenticationResult!.ExpiresIn!,
      issuedAt: Date.now(),
    };
  }

  public async signOut(input: SignOutInput) {
    const command = new RevokeTokenCommand({
      ClientId: CLIENT_ID,
      Token: input.token,
    });

    await this._ctx.auth.send(command);

    return {};
  }

  public async signUp(input: SignUpInput) {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
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

    const { CodeDeliveryDetails } = await this._ctx.auth.send(command);

    return {
      confirmationNeeded: !!CodeDeliveryDetails,
    };
  }

  public async confirmSignUp(input: ConfirmSignUpInput) {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: input.email,
      ConfirmationCode: input.confirmationCode,
    });

    await this._ctx.auth.send(command);

    return {};
  }
}
