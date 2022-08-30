import type { OperationLink, TRPCLink } from "@trpc/client";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { observable } from "@trpc/server/observable";

/**
 * Creates a tRPC link which routes incoming
 * requests to the right service.
 */
export function createMuxLinkForServices<
  TRouter extends AnyRouter,
  TServiceName extends string = string,
  TServiceUrl extends string = string
>(services: Record<TServiceName, TServiceUrl>): TRPCLink<TRouter> {
  return (runtime) => {
    return ({ next, op }) => {
      const links = Object.entries<TServiceUrl>(services).reduce(
        (operationLinks, [serviceName, serviceUrl]) => ({
          ...operationLinks,
          [serviceName]: httpBatchLink({ url: serviceUrl })(runtime),
        }),
        {} as Record<TServiceName, OperationLink<TRouter>>
      );

      const pathParts = op.path.split(".");
      const serviceName = pathParts.shift() as TServiceName;
      const path = pathParts.join(".");

      return observable((observer) => {
        const link = links[serviceName];

        if (!link) {
          observer.error(
            TRPCClientError.from(new Error(`No matching link exists for service "${serviceName}"`))
          );
        }

        return link({
          next,
          op: {
            ...op,
            path,
          },
        }).subscribe({
          next(value) {
            observer.next(value);
          },
          error(error) {
            console.log(error.message);
            observer.error(error);
          },
          complete() {
            observer.complete();
          },
        });
      });
    };
  };
}
