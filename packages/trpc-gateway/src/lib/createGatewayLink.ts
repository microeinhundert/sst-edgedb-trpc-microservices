import type { OperationLink, TRPCLink } from "@trpc/client";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";

/**
 * Creates a tRPC link which routes incoming
 * requests to the correct service.
 */
export function createGatewayLink<
  TRouter extends AnyRouter,
  TServiceName extends string = string,
  TServiceUrl extends string = string
>(services: Record<TServiceName, TServiceUrl>): TRPCLink<TRouter> {
  return (runtime) => {
    const links = Object.entries<TServiceUrl>(services).reduce(
      (operationLinks, [serviceName, serviceUrl]) => ({
        ...operationLinks,
        [serviceName]: httpBatchLink({ url: serviceUrl })(runtime),
      }),
      {} as Record<TServiceName, OperationLink<TRouter>>
    );

    return (ctx) => {
      const { op } = ctx;

      const pathParts = op.path.split(".");
      const serviceName = pathParts.shift() as TServiceName;
      const path = pathParts.join(".");

      const link = links[serviceName];

      if (!link) {
        throw TRPCClientError.from(
          new Error(`No matching link exists for service "${serviceName}"`)
        );
      }

      return link({
        ...ctx,
        op: {
          ...op,
          path,
        },
      });
    };
  };
}
