"use client";
import Link from "next/link";
import { Page } from "~/components/page";
import { PoolDashboard } from "~/components/pool/pool-dashboard";
import { redirect, useParams } from "next/navigation";
import { Address } from "viem";
import { usePoolById } from "~/components/pool/use-pool";

export default function DashboardPoolPage() {
  const { poolAddress } = useParams();

  const { data: pool } = usePoolById(poolAddress as Address);

  return (
    <Page
      title="Dashboard"
      description="Manage your funding pools and view detailed information."
    >
      <PoolDashboard pool={pool} />
    </Page>
  );
}

function PoolCardSkeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50" />;
}
