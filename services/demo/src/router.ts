import { createRouter } from "@sst-app/trpc";

import { helloWorld } from "./procedures/queries/helloWorld";

export const router = createRouter({
  helloWorld,
});
