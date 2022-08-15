import type { StackContext } from "@serverless-stack/resources";
import { Auth } from "@serverless-stack/resources";

export function AuthStack({ stack }: StackContext) {
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    cdk: {
      userPool: {
        passwordPolicy: {
          minLength: 6,
          requireLowercase: false,
          requireUppercase: false,
          requireDigits: false,
          requireSymbols: false,
        },
      },
    },
  });

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
  });

  return { auth };
}
