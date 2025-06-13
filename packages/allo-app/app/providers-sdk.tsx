import { AlloKitSDK } from "@allo-kit/sdk";
import { createContext, PropsWithChildren, useMemo } from "react";
import { useCurrentChainName } from "~/hooks/use-current-chain";

import * as chains from "viem/chains";
import { useWalletClient } from "wagmi";

export const AlloKitSDKContext = createContext<AlloKitSDK | null>(null);

export function AlloKitSDKProvider({ children }: PropsWithChildren) {
  const sdk = useAlloKitSDK();
  return (
    <AlloKitSDKContext.Provider value={sdk}>
      {children}
    </AlloKitSDKContext.Provider>
  );
}

export function useAlloKitSDK() {
  const network = useCurrentChainName();
  const chainId = chains[network as keyof typeof chains]?.id;
  const { data } = useWalletClient({ chainId });
  return useMemo(
    () => (data && chainId ? new AlloKitSDK(data, chainId) : null),
    [data, chainId]
  );
}
