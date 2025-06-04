"use client";
import { ShoppingCart, XIcon } from "lucide-react";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAllocate } from "~/components/allocation/use-allocate";
import { buildAllocations, useCart } from "~/components/cart/use-cart";
import { AllowanceCheck } from "../token/allowance-check";
import { formatNumber } from "~/lib/format";
import { useToken } from "~/components/token/use-token";
import { useRegistrations } from "../registration/use-register";
import { Grid } from "../grid";
import { AllocationItem } from "./allocation-item";
import { TokenAmount } from "../token/token-amount";
import { useEffect } from "react";

export function AllocationForm({
  strategyAddress,
  tokenAddress,
}: {
  strategyAddress: Address;
  tokenAddress: Address;
}) {
  const { address } = useAccount();
  const token = useToken(tokenAddress, address);
  const cart = useCart();
  const allocate = useAllocate({ strategyAddress });
  const projects = useRegistrations({
    where: {
      address_in: Object.keys(cart.items) as Address[],
    },
  });

  useEffect(() => {
    console.log(projects.data?.items);
    if (!projects.data?.items) return;
    // TODO: Make sure the cart items are in the projects
    const missing =
      Object.keys(cart.items).filter(
        (item) => !projects.data?.items.some((p) => p.address === item)
      ) ?? [];

    console.log("missing", missing);
    missing.forEach(cart.remove);
  }, [projects.data?.items]);
  const error = projects.error || allocate.error;

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
        renderItem={(project, i) => (
          <AllocationItem
            {...project}
            key={project?.id}
            actions={
              <>
                <Input
                  name={address}
                  className="sm:w-48 sm:mr-10"
                  placeholder="0"
                  type="number"
                  min={0}
                  step={0.0000000001}
                  value={cart.items[project?.address as Address]}
                  onChange={(e) =>
                    cart.set(
                      project.address,
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <Button
                  className="absolute top-2 right-2"
                  tabIndex={-1}
                  size={"icon"}
                  icon={XIcon}
                  variant={"ghost"}
                  type="button"
                  onClick={() => cart.remove(project.address)}
                />
              </>
            }
          />
        )}
      />
      <div className="py-4 mt-2 mb-4 border-y sm:flex items-center justify-between">
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
            spenderAddress={strategyAddress}
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
