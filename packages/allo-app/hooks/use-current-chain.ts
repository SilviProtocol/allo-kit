"use client";
import { chains, defaultChain } from "~/config";
import { createGlobalState } from "./use-global-state";

const useNetworkState = createGlobalState<string>(
  global.localStorage?.getItem("network") ?? defaultChain
);

export function useCurrentChainName() {
  const [network] = useNetworkState();
  return network ?? defaultChain;
}

export function useSetNetwork() {
  const [, set] = useNetworkState();
  return (network: string) => {
    set(network);
    global.localStorage?.setItem("network", network);
  };
}

export const chainIdToNetwork = (chainId?: number) => {
  return Object.values(chains).find((chain) => chain.id === chainId);
};

export const networkToChainId = (network?: string) =>
  network
    ? Object.entries(chains).find(([key, name]) => key === network)?.[1]?.id
    : undefined;
