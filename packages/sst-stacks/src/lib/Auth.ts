import type { StackContext } from "@serverless-stack/resources";
import { Auth } from "@serverless-stack/resources";
import { PASSWORD_POLICY_LAX } from "@sst-app/common";

export function AuthStack({ stack }: StackContext) {
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    triggers: {
      preSignUp: "services/auth/handlers.preSignUp",
    },
    cdk: {
      userPool: {
        passwordPolicy: PASSWORD_POLICY_LAX,
      },
      userPoolClient: {
        authFlows: {
          userPassword: true,
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
