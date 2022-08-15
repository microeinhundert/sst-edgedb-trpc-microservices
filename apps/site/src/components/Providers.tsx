import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { trpc, trpcClient } from "../utils/trpc.js";

const queryClient = new QueryClient();

export interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

export { Providers };
