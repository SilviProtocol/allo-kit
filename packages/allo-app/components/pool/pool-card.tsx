"use client";

import Link from "next/link";
import { ComponentProps } from "react";

import { cn } from "~/lib/utils";
import { BackgroundImage } from "../background-image";
import { EnsName } from "../ens";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { NetworkBadge } from "../network-badge";
import { useToken } from "../token/use-token";
import { Address } from "viem";
import { TokenAmount } from "../token/token-amount";
import { Pool } from "./schemas";

export function PoolCard({
  isLoading,
  ...pool
}: Pool & {
  isLoading?: boolean;
} & ComponentProps<"button">) {
  console.log(pool);

  const tokenAddress = pool?.distributionToken as Address;
  const matchingToken = useToken(tokenAddress, pool?.address);
  const matchingFunds = matchingToken.data?.balance ?? BigInt(0);

  if (isLoading)
    return (
      <div className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
    );
  return (
    <Card
      className={cn(
        "pt-0 shadow-none aspect-video hover:opacity-90 transition-opacity relative",
        {
          ["animate-pulse"]: isLoading,
        }
      )}
    >
      <Badge className="absolute top-2 left-2">{pool?.strategy?.name}</Badge>
      <BackgroundImage
        src={pool?.metadata?.image}
        fallbackSrc={pool?.metadata?.image}
        className="aspect-video bg-gray-100 h-36"
      />
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">{pool?.metadata?.title}</CardTitle>
        {/* <div className="flex gap-1 items-center">
          <NetworkBadge chainId={pool?.chainId} />
        </div> */}
      </CardHeader>
      <CardContent>
        <p>{pool?.metadata?.description}</p>
        <Separator className="my-4" />
        <div className="flex gap-2 items-end">
          <div className="text-lg font-bold">
            <TokenAmount amount={matchingFunds} token={tokenAddress} />
          </div>
          <div className="text-sm pb-0.5">in matching</div>
        </div>
      </CardContent>
    </Card>
  );
}
