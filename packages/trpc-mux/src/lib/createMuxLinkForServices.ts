/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OperationLink, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { AnyRouter } from "@trpc/server";
import { observable } from "@trpc/server/observable";

/**
 * Creates a tRPC link which routes incoming
 * requests to the right service.
 */
export function createMuxLinkForServices<K extends string, V extends string, R extends AnyRouter>(
  services: Record<K, V>,
  _: R
): TRPCLink<R> {
  return (runtime) => {
    return ({ next, op }) => {
      const links = Object.entries<V>(services).reduce(
        (operationLinks, [serviceName, serviceUrl]) => ({
          ...operationLinks,
          [serviceName]: httpBatchLink({ url: serviceUrl })(runtime),
        }),
        {} as Record<K, OperationLink<R>>
      );

      const pathParts = op.path.split(".");
      const serviceName = pathParts.shift() as K;
      const path = pathParts.join(".");

      if (serviceName && links[serviceName]) {
        const link = links[serviceName];

        link({
          next,
          op: {
            ...op,
            path,
          },
        });
      } else {
        throw new Error(`No tRPC link exists for service "${serviceName}"`);
      }

      return observable((observice) => {
        return next(op).subscribe({
          next(value) {
            observice.next(value);
          },
          error(err) {
            observice.error(err);
          },
          complete() {
            observice.complete();
          },
        });
      });
    };
  };
}
