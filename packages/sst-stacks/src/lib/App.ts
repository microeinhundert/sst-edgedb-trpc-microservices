import type { App } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AppsStack } from "./Apps";
import { AuthStack } from "./Auth";
import { ConfigStack } from "./Config";
import { PersistenceStack } from "./Persistence";
import { ServicesStack } from "./Services";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    timeout: 10,
    bundle: {
      format: "esm",
    },
  });

  app
    .stack(ConfigStack)
    .stack(PersistenceStack)
    .stack(AuthStack)
    .stack(ApiStack)
    .stack(ServicesStack)
    .stack(AppsStack);
}
