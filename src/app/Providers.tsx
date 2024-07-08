import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";

type Network = "mainnet" | "testnet" | undefined;
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    let defaultNetName: Network;
    if (process.env.NEXT_PUBLIC_ENV === "test") {
      defaultNetName = "testnet";
    } else {
      defaultNetName = "mainnet";
    }
  
    // const store = useMemo(
    //   () =>
    //     typeof window === "undefined"
    //       ? createInMemoryStorage()
    //       : createLocalStorage(),
    //   [],
    // );
  
    return (
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    );
  }
  