import type { StackContext } from "@serverless-stack/resources";
import { Function } from "@serverless-stack/resources";

export function TriggersStack({ stack }: StackContext) {
  return {
    triggerHandlers: {
      authPreSignUp: new Function(stack, "AuthPreSignUpTrigger", {
        srcPath: "services/auth",
        handler: "handlers.preSignUp",
      }),
    },
  };
}
