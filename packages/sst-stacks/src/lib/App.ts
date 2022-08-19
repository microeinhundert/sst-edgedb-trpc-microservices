import type { App } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { ConfigStack } from "./Config";
import { PersistenceStack } from "./Persistence";
import { ServicesStack } from "./Services";
import { SiteStack } from "./Site";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    timeout: 10,
    bundle: {
      format: "esm",
    },
  });

  app
    .stack(PersistenceStack)
    .stack(AuthStack)
    .stack(ConfigStack)
    .stack(ApiStack)
    .stack(ServicesStack)
    .stack(SiteStack);
}
