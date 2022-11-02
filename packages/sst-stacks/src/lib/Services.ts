import type { StackContext } from "@serverless-stack/resources";
import { Function, use } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { ConfigStack } from "./Config";
import { addPersistenceBindingsAndPermissions } from "./Persistence";
import { generateServiceRoutes } from "./utils/api";

export function ServicesStack({ stack }: StackContext) {
  const { REGION } = use(ConfigStack);
  const { api } = use(ApiStack);

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
}
