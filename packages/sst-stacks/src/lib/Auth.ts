import type { StackContext } from "@serverless-stack/resources";
import { Cognito, Config, use } from "@serverless-stack/resources";
import { PASSWORD_POLICY_LAX } from "@sst-app/common";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { ConfigStack } from "./Config";
import { PersistenceStack } from "./Persistence";
import { getAuthCallbackUrls, getAuthLogoutUrls } from "./utils/auth";

export function AuthStack({ stack }: StackContext) {
  const { REGION } = use(ConfigStack);
  const { edgeDBParameters } = use(PersistenceStack);

  const cognito = new Cognito(stack, "Cognito", {
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
        signInCaseSensitive: false,
        standardAttributes: {
          givenName: {
            required: true,
            mutable: true,
          },
          familyName: {
            required: true,
            mutable: true,
          },
        },
      },
      userPoolClient: {
        oAuth: {
          callbackUrls: getAuthCallbackUrls(stack.stage === "dev"),
          logoutUrls: getAuthLogoutUrls(stack.stage === "dev"),
        },
        authFlows: {
          userSrp: true,
          userPassword: true,
        },
      },
    },
  });

  const cognitoDomain = cognito.cdk.userPool.addDomain("AuthDomain", {
    cognitoDomain: {
      domainPrefix: `${stack.stage}-microeinhundert-cloud`,
    },
  });

  const cognitoParameters = {
    COGNITO_USER_POOL_ID: new Config.Parameter(stack, "COGNITO_USER_POOL_ID", {
      value: cognito.userPoolId,
    }),
    COGNITO_USER_POOL_CLIENT_ID: new Config.Parameter(stack, "COGNITO_USER_POOL_CLIENT_ID", {
      value: cognito.userPoolClientId,
    }),
    COGNITO_BASE_URL: new Config.Parameter(stack, "COGNITO_BASE_URL", {
      value: cognitoDomain.baseUrl(),
    }),
  };

  stack.addOutputs({
    UserPoolId: cognito.userPoolId,
    UserPoolClientId: cognito.userPoolClientId,
    BaseUrl: cognitoDomain.baseUrl(),
  });

  return { cognito, cognitoParameters };
}
