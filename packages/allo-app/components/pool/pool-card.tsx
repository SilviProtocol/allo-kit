"use client";

import { ComponentProps } from "react";
import { Address } from "viem";

import { cn } from "~/lib/utils";
import { BackgroundImage } from "../background-image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useToken } from "../token/use-token";
import { TokenAmount } from "../token/token-amount";
import { Pool } from "./schemas";
import { stripMarkdown } from "~/lib/strip-markdown";

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
        "pt-0 shadow-none aspect-video hover:opacity-90 transition-opacity relative gap-3",
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
        <CardTitle className="text-lg">{pool?.metadata?.title}</CardTitle>
        {/* <div className="flex gap-1 items-center">
          <NetworkBadge chainId={pool?.chainId} />
        </div> */}
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">
          {stripMarkdown(pool?.metadata?.description ?? "", 140)}
        </p>
        <Separator className="my-4" />
        <div className="flex gap-2 items-end text-sm">
          <div className="text-sm font-bold">
            <TokenAmount amount={matchingFunds} token={tokenAddress} />
          </div>
          <div className="text-xs pb-0.5">in matching</div>
        </div>
      </CardContent>
    </Card>
  );
}
