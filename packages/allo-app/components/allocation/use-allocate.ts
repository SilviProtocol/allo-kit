"use client";

import {
  poolAbi,
  useWritePoolAllocate,
  useWritePoolDistribute,
} from "~/generated/wagmi";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { extractErrorReason } from "~/lib/extract-error";
import { ALLOCATIONS_SCHEMA } from "~/queries";
import { useIndexer, IndexerQuery } from "~/hooks/use-indexer";
import { useAccount } from "wagmi";
import { Allocation } from "~/schemas";
import { toast } from "sonner";

export function useAllocate(poolAddress: Address) {
  const allocate = useWritePoolAllocate({});

  const waitFor = useWaitForEvent(poolAbi);

  return useMutation({
    mutationFn: async (args: [Address[], bigint[], Address, Hex[]]) => {
      const hash = await allocate.writeContractAsync(
        { address: poolAddress, args },
        {
          onSuccess: () => toast.success("Allocated!"),
          onError: (error) =>
            toast.error(extractErrorReason(String(error)) ?? "Allocated error"),
        }
      );
      return waitFor(hash, "Allocate");
    },
  });
}

export function useDistribute(poolAddress: Address) {
  const distribute = useWritePoolDistribute();

  const waitFor = useWaitForEvent(poolAbi);

  return useMutation({
    mutationFn: async (args: [Address[], bigint[], Address, Hex[]]) => {
      const hash = await distribute.writeContractAsync(
        { address: poolAddress, args },
        {
          onSuccess: () => toast.success("Distributed!"),
          onError: (error) =>
            toast.error(
              extractErrorReason(String(error)) ?? "Distributed error"
            ),
        }
      );
      return waitFor(hash, "Allocate");
    },
  });
}

// Deposit simply calls allocate with params to transfer tokens to the strategy
// Used to fund strategy contracts
export function useDeposit(poolAddress: Address) {
  const { mutate, mutateAsync, ...rest } = useAllocate(poolAddress);

  return {
    ...rest,
    mutate: ([amount, token]: [bigint, Address]) =>
      mutate([[poolAddress], [amount], token, ["0x"]]),
    mutateAsync: ([amount, token]: [bigint, Address]) =>
      mutateAsync([[poolAddress], [amount], token, ["0x"]]),
  };
}

// Withdraw simply calls distribute with params to transfer tokens to your address
// Used to withdraw funds from strategy contracts
export function useWithdraw(poolAddress: Address) {
  const { address } = useAccount();
  const { mutate, mutateAsync, ...rest } = useDistribute(poolAddress);

  return {
    ...rest,
    mutate: ([amount, token]: [bigint, Address]) =>
      mutate([[address!], [amount], token, ["0x"]]),
    mutateAsync: ([amount, token]: [bigint, Address]) =>
      mutateAsync([[address!], [amount], token, ["0x"]]),
  };
}

export function useAllocations(variables: IndexerQuery) {
  return useIndexer<Allocation>({
    queryKey: ["allocations", variables],
    variables,
    query: ALLOCATIONS_SCHEMA,
    queryFn: async (r) => r.allocations,
  });
}

export function useDistributions(
  poolAddress: Address,
  variables: IndexerQuery
) {
  return useAllocations({
    ...variables,
    where: {
      strategy_in: [poolAddress],
      from_in: [poolAddress],
      ...variables.where,
    },
  });
}

export function useDeposits(poolAddress: Address, variables: IndexerQuery) {
  return useAllocations({
    ...variables,
    where: {
      strategy_in: [poolAddress],
      to_in: [poolAddress],
      ...variables.where,
    },
  });
}
