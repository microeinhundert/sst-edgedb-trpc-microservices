import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./createContext";

export const { router: createRouter, procedure } = initTRPC.context<Context>().create({
  transformer: superjson,
});
