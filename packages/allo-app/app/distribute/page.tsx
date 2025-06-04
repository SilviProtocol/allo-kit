"use client";

import { useAccount } from "wagmi";
import { MintTokens } from "~/components/mint-tokens";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { AllocationsTable } from "~/components/allocation/allocations-table";
import { QuadraticDistribution } from "~/components/distribution/distribution-quadratic";
import { usePoolById } from "~/components/pool/use-pool";
import { useParams } from "next/navigation";
import { Address } from "viem";

export default function DistributePage() {
  const { address } = useAccount();
  const params = useParams();
  const { data: pool } = usePoolById(params.poolAddress as Address);
  const poolAddress = pool?.address as Address;
  const tokenAddress = pool?.allocationToken as Address;

  return (
    <Page title="Matching Funds">
      <p className="pb-4 text-lg">
        Add matching funds to be distributed to projects based on quadratic
        voting.
      </p>
      <QuadraticDistribution
        poolAddress={poolAddress}
        tokenAddress={tokenAddress}
      />

      <h3 className="mt-8 mb-2 font-semibold">Distributed matching funds</h3>
      <AllocationsTable
        query={{
          where: {
            // Only fetch allocations for this strategy
            strategy_in: [poolAddress],
            // Not any transfers to or from this contract (fund / withdraw)
            to_not_in: [address!],
            from_in: [poolAddress],
          },
          orderBy: "createdAt",
          orderDirection: "desc",
        }}
      />
      <div className="mt-32">
        <MintTokens tokenAddress={tokenAddress} />
      </div>
    </Page>
  );
}
