import type { StackContext } from "@serverless-stack/resources";
import { Function } from "@serverless-stack/resources";

export function TriggersStack({ stack }: StackContext) {
  const serviceOnePreSignUpTriggerFunction = new Function(stack, "PreSignUpTrigger", {
    srcPath: "services/service-one",
    handler: "handlers.preSignUp",
  });

  return {
    serviceOnePreSignUpTriggerFunction,
  };
}
