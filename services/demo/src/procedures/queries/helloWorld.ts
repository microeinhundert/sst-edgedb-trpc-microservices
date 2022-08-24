import { t } from "@sst-app/trpc";

/**
 * Hello World
 */
export const helloWorld = t.procedure.query(() => {
  return { message: "Hello World" };
});
