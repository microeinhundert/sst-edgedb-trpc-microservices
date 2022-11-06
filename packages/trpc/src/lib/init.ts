import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./createContext";

export const {
  router: createRouter,
  procedure,
  middleware,
} = initTRPC.context<Context>().create({
  transformer: superjson,
});
