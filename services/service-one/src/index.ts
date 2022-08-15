import type { Router } from "./lib/router";
import { router } from "./lib/router";

if (!process) {
  throw new Error("Importing service packages from environments other than Node is not allowed");
}

export type { Router };
export { router };
