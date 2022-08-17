import type { App } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { PersistenceStack } from "./Persistence";
import { ServicesStack } from "./Services";
import { SiteStack } from "./Site";
import { TriggersStack } from "./Triggers";

export default function (app: App) {
  app
    .stack(TriggersStack)
    .stack(AuthStack)
    .stack(PersistenceStack)
    .stack(ApiStack)
    .stack(ServicesStack)
    .stack(SiteStack);
}
