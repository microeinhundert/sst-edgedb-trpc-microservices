import type { StackContext } from "@serverless-stack/resources";
import { Function, use } from "@serverless-stack/resources";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { ConfigStack } from "./Config";
import { PersistenceStack } from "./Persistence";
import { generateRoutesForTRPCService } from "./utils/api";

export function ServicesStack({ stack }: StackContext) {
  const { REGION } = use(ConfigStack);
  const { edgeDBParameters } = use(PersistenceStack);
  const { cognitoParameters } = use(AuthStack);
  const { api } = use(ApiStack);

  stack.setDefaultFunctionProps({
    config: [
      REGION,
      edgeDBParameters.EDGEDB_CONNECTION_SECRET_ARN,
      cognitoParameters.COGNITO_USER_POOL_ID,
      cognitoParameters.COGNITO_USER_POOL_CLIENT_ID,
      cognitoParameters.COGNITO_BASE_URL,
    ],
    permissions: [
      new PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        effect: Effect.ALLOW,
        resources: [edgeDBParameters.EDGEDB_CONNECTION_SECRET_ARN.value],
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
    generateRoutesForTRPCService("auth", authFunction, {
      public: true,
    })
  );

  /*
   * Demo
   */

  const demoFunction = new Function(stack, "Demo", {
    handler: "services/demo/handlers.main",
  });

  api.addRoutes(
    stack,
    generateRoutesForTRPCService("demo", demoFunction, {
      public: false,
    })
  );
}
