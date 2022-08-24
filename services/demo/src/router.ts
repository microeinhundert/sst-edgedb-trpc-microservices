import { t } from "@sst-app/trpc";

import { helloWorld } from "./procedures/queries/helloWorld";

export const router = t.router({
  helloWorld,
});
