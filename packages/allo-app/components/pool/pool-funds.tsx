import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { Address } from "viem";
import { TokenAmount } from "../token/token-amount";
import { useQuadraticMatching } from "~/hooks/use-quadratic-matching";
import { EnsName } from "../ens";
import { MatchingFunds } from "../allocation/matching-funds";
import { MintTokens } from "../mint-tokens";
import { useAllocations } from "../allocation/use-allocate";
import { Pool } from "./schemas";

export function PoolFunds({ pool }: { pool: Pool }) {
  const poolAddress = pool?.address;
  const tokenAddress = pool?.distributionToken as Address;

  const Contributions = useAllocations({
    where: {
      pool_in: [poolAddress],
      to_in: [poolAddress],
    },
  });

  const { donations, matchingFunds, matching } = useQuadraticMatching({
    poolAddress,
    tokenAddress,
  });
  const targetFunds = pool?.maxAmount ?? 0n;
  const progressPercentage =
    (Number(matchingFunds ?? 0) / Number(targetFunds ?? 0)) * 100;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Funding Progress</CardTitle>
            <CardDescription>Current funding status and target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>
                  Current:{" "}
                  <TokenAmount token={tokenAddress} amount={matchingFunds} />
                </div>
                <div>
                  Target:{" "}
                  <TokenAmount token={tokenAddress} amount={targetFunds} />
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="pt-8 flex justify-end space-x-2">
              <MatchingFunds
                poolAddress={poolAddress}
                tokenAddress={tokenAddress}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
            <CardDescription>Latest funding transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Contributions.data?.items?.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      <EnsName address={tx.from} />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TokenAmount token={tokenAddress} amount={tx.amount} />
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ArrowUpRight className="h-3 w-3" />
                      <span className="sr-only">View transaction</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <MintTokens tokenAddress={tokenAddress} />
      </div>
    </div>
  );
}
