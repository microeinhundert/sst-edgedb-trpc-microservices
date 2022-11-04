import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./createContext";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const { router: createRouter, procedure } = t;
