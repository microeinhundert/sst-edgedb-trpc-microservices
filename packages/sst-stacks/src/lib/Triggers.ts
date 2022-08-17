import type { StackContext } from "@serverless-stack/resources";
import { Function } from "@serverless-stack/resources";

export function TriggersStack({ stack }: StackContext) {
  const authPreSignUpTriggerFunction = new Function(stack, "PreSignUpTrigger", {
    srcPath: "services/auth",
    handler: "handlers.preSignUp",
  });

  return {
    authPreSignUpTriggerFunction,
  };
}
