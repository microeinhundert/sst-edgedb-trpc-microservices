import { createRouter } from "@sst-app/trpc";

import { issue } from "./credentials/issue";
import { refresh } from "./credentials/refresh";

export const credentials = createRouter({
  issue,
  refresh,
});
