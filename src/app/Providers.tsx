'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import { WalletProvider } from "./WalletProvider";
import { AutoConnectProvider } from "./AutoConnectProvider";
type Network = "mainnet" | "testnet" | undefined;
const queryClient = new QueryClient();

export const Providers = ({ children }: { children?: ReactNode }) => {
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
        <AutoConnectProvider>
        <WalletProvider>
            <QueryClientProvider client={queryClient}>
            {children}
            </QueryClientProvider>
        </WalletProvider>
        </AutoConnectProvider>
    );
  }
  