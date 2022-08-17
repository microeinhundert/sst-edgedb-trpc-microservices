import type { StackContext } from "@serverless-stack/resources";
import { Function, use } from "@serverless-stack/resources";
import type { env as functionEnv } from "@sst-app/lambda-env";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { PersistenceStack } from "./Persistence";
import { generateTRPCServiceRoutes } from "./utils/api";

export function ServicesStack({ stack }: StackContext) {
  const { edgeDB } = use(PersistenceStack);
  const { auth } = use(AuthStack);
  const { api } = use(ApiStack);

  const environment: typeof functionEnv = {
    REGION: stack.region,
    EDGEDB_DSN_SECRET: edgeDB.connectionSecret.secretArn,
    USER_POOL_ID: auth.userPoolId,
    USER_POOL_CLIENT_ID: auth.userPoolClientId,
  };

  stack.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    timeout: 5,
    bundle: {
      format: "esm",
    },
    environment,
    permissions: [
      new PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        effect: Effect.ALLOW,
        resources: [edgeDB.connectionSecret.secretArn],
      }),
    ],
  });

  /*
   * Auth
   */

  const authFunction = new Function(stack, "Auth", {
    srcPath: "services/auth",
    handler: "handlers.main",
  });

  api.addRoutes(
    stack,
    generateTRPCServiceRoutes("auth", authFunction, {
      public: true,
    })
  );
}
