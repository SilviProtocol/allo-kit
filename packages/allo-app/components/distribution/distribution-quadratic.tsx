"use client";

import { useMemo } from "react";
import { Address } from "viem";
import { TokenAmount } from "~/components/token/token-amount";
import { useInvalidate } from "~/hooks/use-invalidate";
import { MatchingFunds } from "~/components/allocation/matching-funds";
import { DistributeButton } from "~/components/allocation/distribute-button";
import { getContributions } from "~/lib/quadratic";
import { Grid } from "~/components/grid";
import { formatNumber } from "~/lib/format";
import { AllocationItem } from "~/components/allocation/allocation-item";
import { Registration } from "~/schemas";
import { useQuadraticMatching } from "~/hooks/use-quadratic-matching";
import { useRegistrations } from "../registration/use-register";

export function QuadraticDistribution({
  poolAddress,
  tokenAddress,
}: {
  poolAddress: Address;
  tokenAddress: Address;
}) {
  const invalidate = useInvalidate();

  const {
    donations,
    matchingFunds,
    matching,
    error: matchingError,
    isLoading,
    queryKeys,
  } = useQuadraticMatching({
    poolAddress,
    tokenAddress,
  });

  // Fetch projects for the donations
  const { data: projects } = useRegistrations({
    where: {
      address_in: donations.map((alloc) => alloc.to),
    },
  });

  const voterCountById = getContributions(donations);
  const items = useMemo(
    () =>
      Object.entries(matching)
        .sort(([_, shareA], [__, shareB]) => Number(shareB) - Number(shareA))
        .map(([address, share]) => ({
          ...(projects?.items.find(
            (item) => item.address === address
          ) as Registration),
          share,
          voterCount: Object.keys(voterCountById[address as Address]).length,
        })),
    [matching, projects, voterCountById]
  );

  return (
    <div>
      <div className="py-4 mt-2 mb-4 border-y sm:flex items-center justify-between">
        Matching funds:{" "}
        <strong>
          <TokenAmount amount={matchingFunds} token={tokenAddress} />
        </strong>
        <MatchingFunds poolAddress={poolAddress} tokenAddress={tokenAddress} />
        <DistributeButton
          poolAddress={poolAddress}
          tokenAddress={tokenAddress}
          matching={matching}
          onSuccess={() => invalidate([queryKeys])}
        />
      </div>
      <Grid
        columns={[1]}
        data={items}
        loadingItems={3}
        isPending={isLoading}
        error={matchingError}
        renderItem={(item, i) => (
          <AllocationItem
            {...item}
            key={item?.id}
            actions={
              <div className="text-sm flex items-center gap-4">
                <TokenAmount amount={item?.share ?? 0n} token={tokenAddress} />
                <div>{formatNumber(item.voterCount)} voters</div>
              </div>
            }
          />
        )}
      />
    </div>
  );
}
