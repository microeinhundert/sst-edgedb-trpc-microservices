import type { StackContext } from "@serverless-stack/resources";
import { Auth, Config, use } from "@serverless-stack/resources";
import { PASSWORD_POLICY_LAX } from "@sst-app/common";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { ConfigStack } from "./Config";
import { PersistenceStack } from "./Persistence";

export function AuthStack({ stack }: StackContext) {
  const { REGION } = use(ConfigStack);
  const { edgeDBParameters } = use(PersistenceStack);

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    triggers: {
      preSignUp: {
        handler: "functions/pre-sign-up-trigger/handlers.main",
        config: [REGION, edgeDBParameters.EDGEDB_CONNECTION_SECRET_ARN],
        permissions: [
          new PolicyStatement({
            actions: ["secretsmanager:GetSecretValue"],
            effect: Effect.ALLOW,
            resources: [edgeDBParameters.EDGEDB_CONNECTION_SECRET_ARN.value],
          }),
        ],
      },
    },
    cdk: {
      userPool: {
        passwordPolicy: PASSWORD_POLICY_LAX,
      },
      userPoolClient: {
        authFlows: {
          userSrp: true,
        },
      },
    },
  });

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
  });

  const authParameters = {
    AUTH_USER_POOL_ID: new Config.Parameter(stack, "AUTH_USER_POOL_ID", {
      value: auth.userPoolId,
    }),
    AUTH_USER_POOL_CLIENT_ID: new Config.Parameter(stack, "AUTH_USER_POOL_CLIENT_ID", {
      value: auth.userPoolClientId,
    }),
  };

  return { auth, authParameters };
}
