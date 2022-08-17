import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { trpc, trpcClient } from "../utils/trpc";

const queryClient = new QueryClient();

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
