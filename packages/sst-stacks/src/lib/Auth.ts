import type { StackContext } from "@serverless-stack/resources";
import { Auth, Config, use } from "@serverless-stack/resources";
import { PASSWORD_POLICY_LAX } from "@sst-app/common";

import { PersistenceStack } from "./Persistence";

export function AuthStack({ stack }: StackContext) {
  const { edgeDB } = use(PersistenceStack);

  const EDGEDB_DSN_SECRET = new Config.Parameter(stack, "EDGEDB_DSN_SECRET", {
    value: edgeDB.connectionSecret.secretArn,
  });

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    triggers: {
      preSignUp: {
        handler: "functions/pre-sign-up-trigger/handlers.main",
        runtime: "nodejs16.x",
        timeout: 10,
        bundle: {
          format: "esm",
        },
        config: [EDGEDB_DSN_SECRET],
      },
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
