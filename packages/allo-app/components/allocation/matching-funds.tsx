"use client";

import { useState } from "react";
import { Address, parseUnits } from "viem";
import { AllowanceCheck } from "~/components/token/allowance-check";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  useAllocations,
  useDeposit,
  useWithdraw,
} from "~/components/allocation/use-allocate";
import { useToken } from "~/components/token/use-token";
import { useInvalidate } from "~/hooks/use-invalidate";

export function MatchingFunds({
  poolAddress,
  tokenAddress,
}: {
  poolAddress: Address;
  tokenAddress: Address;
}) {
  const invalidate = useInvalidate();
  const [value, setValue] = useState<string>("");
  const fund = useDeposit(poolAddress);
  const withdraw = useWithdraw(poolAddress);
  const token = useToken(tokenAddress, poolAddress);
  const contributions = useAllocations({
    where: {
      pool_in: [poolAddress],
      to_in: [poolAddress],
    },
  });
  return (
    <form
      className="flex flex-col sm:flex-row gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        setValue("");
        if (!token.data?.decimals) throw new Error("Couldn't load token");
        fund
          .mutateAsync([parseUnits(value, token.data?.decimals), tokenAddress])
          .then(() => {
            setValue("");
            invalidate([token.queryKey, contributions.queryKey]);
          });
      }}
    >
      <Input
        placeholder="0"
        value={value}
        onChange={(e) =>
          isNaN(+e.target.value) ? "" : setValue(e.target.value)
        }
      />
      <AllowanceCheck
        amount={BigInt(value ?? 0)}
        spenderAddress={poolAddress}
        tokenAddress={tokenAddress}
      >
        <Button type="submit" disabled={!value}>
          Add matching funds
        </Button>
      </AllowanceCheck>
      <Button
        type="button"
        variant={"secondary"}
        disabled={!token.data?.balance}
        onClick={() =>
          withdraw
            .mutateAsync([token.data?.balance!, tokenAddress])
            .then(() => invalidate([token.queryKey]))
        }
      >
        Withdraw
      </Button>
    </form>
  );
}
