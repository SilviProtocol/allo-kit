"use client";

import { Registration } from "~/schemas";
import { EnsName } from "../ens";
import { BackgroundImage } from "../background-image";
import Link from "next/link";
import { NetworkBadge } from "../network-badge";
import { Badge } from "../ui/badge";

export function AllocationItem({
  chainId,
  address,
  metadata,
  pool,
  actions,
}: Registration & {
  actions?: React.ReactNode;
}) {
  return (
    <div className="relative sm:flex rounded border">
      <div className="flex flex-1 items-center gap-2">
        <div className="size-16">
          <BackgroundImage src={metadata?.image} className="bg-gray-100" />
        </div>
        <div className="flex-1">
          <div className="flex items-center  gap-2">
            <h3 className="hover:underline">{metadata?.title}</h3>
          </div>

          <div className="flex items-center  gap-2">
            <Badge variant={"secondary"}>{pool?.metadata?.title}</Badge>
            <NetworkBadge chainId={chainId} />
          </div>
        </div>
      </div>
      <div className="p-2">{actions}</div>
    </div>
  );
}
