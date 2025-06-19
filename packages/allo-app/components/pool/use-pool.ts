"use client";

import { IndexerQuery, useIndexer } from "~/hooks/use-indexer";
import { Pool } from "~/components/pool/schemas";
import { Address, Hex } from "viem";
import { useAccount } from "wagmi";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractErrorReason } from "~/lib/extract-error";
import { PoolConfig } from "./schemas";
import { POOLS_SCHEMA } from "./queries";
import { useAlloKitSDK } from "~/app/providers-sdk";

export function useCreatePool() {
  const sdk = useAlloKitSDK();
  return useMutation({
    mutationFn: async (args: [Address, PoolConfig, Hex]) => {
      const [address, config, data] = args;
      return sdk?.deployPool(address, config, data);
    },
    onSuccess: () => toast.success("Pool created!"),
    onError: (error) =>
      toast.error(extractErrorReason(String(error)) ?? "Create error"),
  });
}

export function useConfigurePool() {
  const sdk = useAlloKitSDK();
  return useMutation({
    mutationFn: async (args: [Address, PoolConfig]) => {
      const [address, config] = args;
      return sdk?.configure(address, config);
    },
    onSuccess: () => toast.success("Pool configured!"),
    onError: (error) =>
      toast.error(extractErrorReason(String(error)) ?? "Configure error"),
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
