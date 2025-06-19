"use client";

import { Page } from "~/components/page";
import { usePoolById } from "~/components/pool/use-pool";
import { useParams, useRouter } from "next/navigation";
import { Address } from "viem";
import { PoolEditForm } from "~/components/pool/pool-edit-form";

export default function DashboardSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const poolAddress = params.poolAddress as Address;

  const { data: pool, isPending } = usePoolById(poolAddress);
  return (
    <Page title="Pool Settings">
      {isPending ? (
        <>loading...</>
      ) : (
        <PoolEditForm
          defaultValues={{
            ...pool,
            strategy: pool?.strategy.address as Address,
          }}
          onSuccess={() => router.push(`/dashboard/${poolAddress}`)}
        />
      )}
    </Page>
  );
}
