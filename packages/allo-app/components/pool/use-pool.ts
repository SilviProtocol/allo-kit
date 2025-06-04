"use client";

import { IndexerQuery, useIndexer } from "~/hooks/use-indexer";
import { Pool } from "~/components/pool/schemas";
import { Address, Hex } from "viem";
import { useAccount } from "wagmi";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { extractErrorReason } from "~/lib/extract-error";
import { useContracts } from "~/hooks/use-contracts";
import { poolFactoryAbi, useWritePoolFactoryDeploy } from "~/generated/wagmi";
import { PoolConfig } from "./schemas";
import { POOLS_SCHEMA } from "./queries";

export function useCreatePool() {
  const { PoolFactory } = useContracts();
  const deploy = useWritePoolFactoryDeploy();
  const waitFor = useWaitForEvent(poolFactoryAbi);
  return useMutation({
    mutationFn: async (args: [Address, PoolConfig, Hex]) => {
      const hash = await deploy.writeContractAsync(
        { address: PoolFactory.address, args },
        {
          onSuccess: () => toast.success("Created!"),
          onError: (error) =>
            toast.error(extractErrorReason(String(error)) ?? "Create error"),
        }
      );
      return waitFor<{ pool: Address }>(hash, "Created");
    },
  });
}

export function usePools(
  variables: IndexerQuery,
  { enabled }: { enabled?: boolean } = {}
) {
  return useIndexer<Pool>({
    queryKey: ["pools", variables],
    variables,
    query: POOLS_SCHEMA,
    queryFn: async (r) => r?.pools,
    enabled,
  });
}
export function usePoolById(address: Address) {
  const { data, ...rest } = usePools({ where: { address_in: [address] } });
  return { ...rest, data: data?.items?.[0] };
}

export function usePoolsByOwner() {
  const { address } = useAccount();
  return usePools(
    { where: { owner_in: [address as Address] } },
    { enabled: Boolean(address) }
  );
}
