import type { MaybePromise } from "@sst-app/types";

type AuthenticationFlowContextSetter<TInitialContextValue, TContextValue> = (
  newContext: TInitialContextValue | TContextValue
) => TInitialContextValue | TContextValue;

type AuthenticationFlowStages<TInitialContextValue, TContextValue> = Record<
  string,
  (
    setter: AuthenticationFlowContextSetter<TInitialContextValue, TContextValue>
  ) => MaybePromise<void>
>;

type AuthenticationFlowCallbacks = {
  onError?: (error: unknown) => MaybePromise<void>;
};

export async function* createAuthenticationFlow<TContextValue, TInitialContextValue = null>(
  stages: AuthenticationFlowStages<TInitialContextValue, TContextValue>,
  initialContext: TInitialContextValue,
  callbacks?: AuthenticationFlowCallbacks
): AsyncGenerator<TInitialContextValue | TContextValue, void, void> {
  let context: TInitialContextValue | TContextValue = initialContext;

  const contextSetter: AuthenticationFlowContextSetter<TInitialContextValue, TContextValue> = (
    newContext
  ) => {
    return (context = newContext);
  };

  for (const [stageIdentifier, stage] of Object.entries(stages)) {
    try {
      await stage.apply({ set: contextSetter }, [contextSetter]);
      yield context;
    } catch (error) {
      if (callbacks?.onError) {
        await callbacks.onError(error);
        break;
      } else {
        if (error instanceof Error) {
          throw new Error(
            `An error occurred in the authentication flow at stage "${stageIdentifier}": ${error.message}`
          );
        }
        throw new Error(
          `An unknown error occurred in the authentication flow at stage "${stageIdentifier}"`
        );
      }
    }
  }
}
