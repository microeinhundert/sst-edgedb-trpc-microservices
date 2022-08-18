import type { StackContext } from "@serverless-stack/resources";
import { Config, Function, use } from "@serverless-stack/resources";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { PersistenceStack } from "./Persistence";
import { generateTRPCServiceRoutes } from "./utils/api";

export function ServicesStack({ stack }: StackContext) {
  const { edgeDB } = use(PersistenceStack);
  const { auth } = use(AuthStack);
  const { api } = use(ApiStack);

  const REGION = new Config.Parameter(stack, "REGION", {
    value: stack.region,
  });
  const EDGEDB_DSN_SECRET = new Config.Parameter(stack, "EDGEDB_DSN_SECRET", {
    value: edgeDB.connectionSecret.secretArn,
  });
  const USER_POOL_ID = new Config.Parameter(stack, "USER_POOL_ID", {
    value: auth.userPoolId,
  });
  const USER_POOL_CLIENT_ID = new Config.Parameter(stack, "USER_POOL_CLIENT_ID", {
    value: auth.userPoolClientId,
  });

  stack.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    timeout: 5,
    bundle: {
      format: "esm",
    },
    config: [REGION, EDGEDB_DSN_SECRET, USER_POOL_ID, USER_POOL_CLIENT_ID],
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
    handler: "services/auth/handlers.main",
  });

  api.addRoutes(
    stack,
    generateTRPCServiceRoutes("auth", authFunction, {
      public: true,
    })
  );
}
