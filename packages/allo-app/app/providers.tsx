"use client";
import { PropsWithChildren } from "react";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  safeWallet,
  rainbowWallet,
  coinbaseWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { rainbowkitBurnerWallet } from "burner-connector";
import { chains, defaultChain } from "~/config";
import { AlloKitSDKProvider } from "./providers-sdk";

export const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Allo Simple Grants",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: Object.values(chains) as [Chain, ...Chain[]],
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        safeWallet,
        rainbowWallet,
        coinbaseWallet,
        metaMaskWallet,
        // walletConnectWallet,
        ...(process.env.NODE_ENV === "development"
          ? [rainbowkitBurnerWallet]
          : []),
      ],
    },
  ],
  ssr: true,
});

export function Providers(props: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={chains[defaultChain]}>
          <AlloKitSDKProvider>{props.children}</AlloKitSDKProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
