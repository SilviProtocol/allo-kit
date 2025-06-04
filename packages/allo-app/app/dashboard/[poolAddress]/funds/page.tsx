"use client";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { Page } from "~/components/page";
import { usePoolById } from "~/components/pool/use-pool";
import { PoolFunds } from "~/components/pool/pool-funds";
import { useContracts } from "~/hooks/use-contracts";

export default function DashboardFundsPage() {
  const { poolAddress } = useParams();

  const { data: pool } = usePoolById(poolAddress as Address);

  return (
    <Page title="Pool Funds">
      <PoolFunds pool={pool} />
    </Page>
  );
}
