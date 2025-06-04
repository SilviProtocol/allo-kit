"use client";
import Link from "next/link";
import { Page } from "~/components/page";
import { usePools } from "~/components/pool/use-pool";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Grid } from "~/components/grid";
import { Button } from "~/components/ui/button";
import { PoolCard } from "~/components/pool/pool-card";
import { PlusIcon } from "lucide-react";

export default function DashboardPage() {
  const { address } = useAccount();
  const {
    data: pools,
    error,
    isPending,
  } = usePools({
    where: {
      owner_in: [address as Address],
    },
  });

  return (
    <Page
      title="Dashboard"
      actions={
        <Link href="/dashboard/create-pool">
          <Button icon={PlusIcon}>Create new pool</Button>
        </Link>
      }
    >
      <Grid
        emptyState={{
          title: "No pools found",
          description: "Create a new pool to get started",
        }}
        columns={[1, 2, 3, 3]}
        data={pools?.items}
        error={error}
        isPending={isPending}
        renderItem={(pool) => (
          <Link
            href={`/dashboard/${pool?.address}`}
            key={pool?.address ?? pool?.id}
          >
            <PoolCard {...pool} />
          </Link>
        )}
      />
    </Page>
  );
}

function PoolCardSkeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50" />;
}
