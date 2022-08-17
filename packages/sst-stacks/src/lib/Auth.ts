import type { StackContext } from "@serverless-stack/resources";
import { Auth, use } from "@serverless-stack/resources";
import { PASSWORD_POLICY_LAX } from "@sst-app/common";

import { TriggersStack } from "./Triggers";

export function AuthStack({ stack }: StackContext) {
  const { serviceOnePreSignUpTriggerFunction } = use(TriggersStack);

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    triggers: {
      preSignUp: serviceOnePreSignUpTriggerFunction,
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
