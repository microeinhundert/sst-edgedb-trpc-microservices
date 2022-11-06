import type { StackContext } from "@serverless-stack/resources";
import { Function, use } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { ConfigStack } from "./Config";
import { addPersistenceBindingsAndPermissions } from "./Persistence";
import { generateServiceRoutes } from "./utils/api";

export function ServicesStack({ stack }: StackContext) {
  const { REGION } = use(ConfigStack);
  const { api } = use(ApiStack);
  const { cognitoParameters } = use(AuthStack);

  addPersistenceBindingsAndPermissions(stack);
  stack.addDefaultFunctionBinding([REGION]);

  /*
   * Demo
   */

  const demoFunction = new Function(stack, "Demo", {
    handler: "services/demo/handlers.main",
  });

  api.addRoutes(
    stack,
    generateServiceRoutes("demo", demoFunction, {
      public: true,
    })
  );

  /*
   * Auth
   */

  const authFunction = new Function(stack, "Auth", {
    handler: "services/auth/handlers.main",
    bind: Object.values(cognitoParameters),
  });

  api.addRoutes(
    stack,
    generateServiceRoutes("auth", authFunction, {
      public: true,
    })
  );
}
