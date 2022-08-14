import type { OperationLink, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

/**
 * Creates tRPC links which route incoming
 * requests to the right tRPC server.
 */
export function createMuxLinksForServers<K extends string, V extends string>(
  servers: Record<K, V>
): TRPCLink<any>[] {
  return [
    (runtime) => {
      const links = Object.entries<V>(servers).reduce(
        (operationLinks, [serverName, serverUrl]) => ({
          ...operationLinks,
          [serverName]: httpBatchLink({ url: serverUrl })(runtime),
        }),
        {} as Record<K, OperationLink<any>>
      );

      return ({ op, ...ctx }) => {
        const pathParts = op.path.split(".");
        const serverName = pathParts.shift() as K;
        const path = pathParts.join(".");

        if (serverName && links[serverName]) {
          const link = links[serverName];

          link({
            ...ctx,
            op: {
              ...op,
              path,
            },
          });
        } else {
          throw new Error(`No tRPC link exists for server "${serverName}"`);
        }
      };
    },
  ];
}
