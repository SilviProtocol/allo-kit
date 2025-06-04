"use client";
import { ShoppingCart, XIcon } from "lucide-react";
import { Address, getAddress, Hex } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  useAllocate,
  useAllocations,
} from "~/components/allocation/use-allocate";
import {
  buildAllocations,
  cartItemsToIds,
  useCart,
  usePruneCart,
} from "~/components/cart/use-cart";
import { AllowanceCheck } from "../token/allowance-check";
import { formatNumber } from "~/lib/format";
import { useToken } from "~/components/token/use-token";
import { Grid } from "../grid";
import { AllocationItem } from "./allocation-item";
import { formatTokenAmount, TokenAmount } from "../token/token-amount";
import { calculateQuadraticMatching } from "~/lib/quadratic";
import { Allocation, Registration } from "~/schemas";
import { NumberInput } from "../number-input";
import { useQuadraticMatching } from "~/hooks/use-quadratic-matching";
import { useEffect } from "react";
import { useRegistrations } from "../registration/use-register";

export function AllocationFormMatching({
  poolAddress,
  tokenAddress,
}: {
  poolAddress: Address;
  tokenAddress: Address;
}) {
  const { address } = useAccount();
  const token = useToken(tokenAddress, address);
  const cart = useCart();
  const allocate = useAllocate(poolAddress);

  const { pools, ids, chainIds } = cartItemsToIds(cart.items);
  const projects = useRegistrations({
    where: { pool_in: pools, address_in: ids, chainId_in: chainIds },
  });

  // Remove projects that doesn't exist from cart
  usePruneCart(projects.data?.items);

  const {
    matching,
    estimateMatching,
    error: matchingError,
    isLoading,
    queryKeys,
  } = useQuadraticMatching({
    poolAddress,
    tokenAddress,
  });

  const error = projects.error || allocate.error;

  console.log(cart.items, cart);

  const estimated = estimateMatching(
    Object.entries(cart.items).map(([id, amount]) => ({
      amount: BigInt(amount ?? 0) * 10n ** BigInt(token.data?.decimals ?? 18),
      to: id,
      from: poolAddress,
      token: tokenAddress,
    }))
  );

  console.log(estimated);
  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const [recipients, amounts] = buildAllocations(
          cart.items,
          token.data?.decimals
        );
        allocate
          .mutateAsync([
            recipients,
            amounts,
            tokenAddress,
            recipients.map(() => "0x"), // Empty data
          ])
          .then(() => cart.reset());
      }}
    >
      <Grid
        columns={[1]}
        loadingItems={3}
        isPending={projects.isPending}
        data={projects.data?.items}
        error={error}
        emptyState={{
          title: "Cart Empty",
          description: "Add projects to your cart to allocate",
          icon: ShoppingCart,
        }}
        renderItem={(project, i) => {
          const amount = estimated[project?.id as Address];
          return (
            <AllocationItem
              {...project}
              key={project?.id}
              actions={
                <div className="sm:flex items-center gap-2">
                  {amount ? (
                    <div className="p-2 text-sm">
                      Matching:{" "}
                      {formatTokenAmount(amount, token.data?.decimals ?? 18)}
                    </div>
                  ) : null}
                  <NumberInput
                    name={address}
                    className="sm:w-48 sm:mr-10"
                    placeholder="0"
                    allowNegative={false}
                    step={0.0000000001}
                    value={cart.items[project?.id as Address]}
                    onValueChange={({ floatValue }) =>
                      cart.set(project.id, floatValue)
                    }
                  />
                  <Button
                    className="absolute top-2 right-2"
                    tabIndex={-1}
                    size={"icon"}
                    icon={XIcon}
                    variant={"ghost"}
                    type="button"
                    onClick={() => cart.remove(project.id)}
                  />
                </div>
              }
            />
          );
        }}
      />
      <div className="py-4 mt-2 mb-4 sm:flex items-center justify-between">
        <div className="flex justify-end flex-1 mr-4 gap-1">
          Total: {formatNumber(Number(cart.sum))} /
          <strong>
            <TokenAmount amount={token.data?.balance!} token={tokenAddress} />
          </strong>
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="outline" onClick={() => cart.reset()}>
            Reset Cart
          </Button>
          <AllowanceCheck
            amount={cart.sum}
            tokenAddress={tokenAddress}
            spenderAddress={poolAddress}
          >
            <Button
              className="w-48"
              type="submit"
              disabled={!cart.list.length}
              isLoading={allocate.isPending}
            >
              Transfer tokens
            </Button>
          </AllowanceCheck>
        </div>
      </div>
    </form>
  );
}
