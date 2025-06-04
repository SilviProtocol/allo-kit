"use client";

import { Address } from "viem";

import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";

import { BackgroundImage } from "~/components/background-image";
import { Badge } from "~/components/ui/badge";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";

import { usePoolById } from "~/components/pool/use-pool";
import { Markdown } from "~/components/markdown";
import { RegistrationsList } from "~/components/registration/registrations-list";
import Link from "next/link";
import { NetworkBadge } from "~/components/network-badge";

function ApplyPoolButton({ poolAddress }: { poolAddress: Address }) {
  // TODO: Check if pool can be applied to
  return (
    <Link prefetch href={`/app/pools/${poolAddress}/apply`}>
      <Button>Apply to Pool</Button>
    </Link>
  );
}

function ManagePoolButton({ poolAddress }: { poolAddress: Address }) {
  // TODO: Check if connected wallet is owner
  return (
    <Link prefetch href={`/dashboard/${poolAddress}`}>
      <Button variant="outline" icon={Pencil}>
        Manage Pool
      </Button>
    </Link>
  );
}

export default function PoolDetailsPage() {
  const params = useParams();
  const poolAddress = params.poolAddress as Address;
  const { data: pool } = usePoolById(poolAddress);

  return (
    <Page
      title={
        <div className="flex gap-2 items-center">{pool?.metadata.title}</div>
      }
      actions={
        <>
          <ApplyPoolButton poolAddress={poolAddress} />
          <ManagePoolButton poolAddress={poolAddress} />
        </>
      }
    >
      <div className="flex gap-2 items-center mb-2">
        <Badge>{pool?.strategy.name}</Badge>
        <NetworkBadge chainId={pool?.chainId} />
      </div>
      <BackgroundImage
        src={pool?.metadata.image}
        className="min-h-48 bg-gray-200"
      />
      <div className="py-8">
        <Markdown className="">{pool?.metadata.description}</Markdown>
      </div>

      <h3 className=" font-semibold">Projects</h3>
      <RegistrationsList
        query={{
          where: { pool_in: [poolAddress], isApproved: true },
        }}
      />
    </Page>
  );
}
