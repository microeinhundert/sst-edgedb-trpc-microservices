import { createRouter } from "@sst-app/trpc";

import { credentials } from "./procedures/mutations/credentials";
import { userInfo } from "./procedures/queries/userInfo";

export const router = createRouter({
  credentials,
  userInfo,
});
