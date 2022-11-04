import { procedure } from "@sst-app/trpc";

/**
 * Hello World
 */
export const helloWorld = procedure.query(() => {
  return { message: "Hello World" };
});
