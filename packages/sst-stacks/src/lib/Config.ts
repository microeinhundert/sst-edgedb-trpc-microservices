import type { StackContext } from "@serverless-stack/resources";
import { Config } from "@serverless-stack/resources";

export function ConfigStack({ stack }: StackContext) {
  const REGION = new Config.Parameter(stack, "REGION", {
    value: stack.region,
  });

  return { REGION };
}
