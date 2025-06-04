"use client";
import { Address } from "viem";
import { useAllocations } from "~/components/allocation/use-allocate";
import { useToken } from "~/components/token/use-token";
import { calculateQuadraticMatching } from "~/lib/quadratic";
import { Allocation } from "~/schemas";

type UseQuadraticMatchingProps = {
  poolAddress: Address;
  tokenAddress: Address;
};

export function useQuadraticMatching({
  poolAddress,
  tokenAddress,
}: UseQuadraticMatchingProps) {
  const allocations = useAllocations({
    where: {
      pool_in: [poolAddress],
      to_not_in: [poolAddress],
      from_not_in: [poolAddress],
    },
  });

  const matchingToken = useToken(tokenAddress, poolAddress);
  const matchingFunds = matchingToken.data?.balance ?? BigInt(0);
  const donations = allocations.data?.items ?? [];

  const matching = calculateQuadraticMatching(donations, matchingFunds);

  return {
    donations,
    matchingFunds,
    matching,
    estimateMatching: (additionalAllocations: Allocation[]) => {
      const estimated = calculateQuadraticMatching(
        [...donations, ...additionalAllocations],
        matchingFunds
      );
      return Object.fromEntries(
        Object.entries(estimated).map(([address, amount]) => [
          address,
          amount - (matching[address as Address] ?? 0n),
        ])
      );
    },
    isLoading: allocations.isPending || matchingToken.isPending,
    error: allocations.error || matchingToken.error,
    queryKeys: {
      matchingToken: matchingToken.queryKey,
      allocations: allocations.queryKey,
    },
  };
}
