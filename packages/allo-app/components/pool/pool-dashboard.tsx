"use client";

import { Coins, FileText, HandCoins, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Address } from "viem";
import { useToken } from "../token/use-token";
import { TokenAmount } from "../token/token-amount";
import { Pool } from "./schemas";

export function PoolDashboard({ pool }: { pool: Pool }) {
  const matchingToken = useToken(
    pool?.allocationToken as Address,
    pool?.address
  );
  const matchingFunds = matchingToken.data?.balance ?? BigInt(0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <TokenAmount
                amount={matchingFunds}
                token={pool?.allocationToken as Address}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {"-"}
              {/* {selectedPool.applicationsCount} */}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Funders</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"-"}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"-"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Skeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50" />;
}
