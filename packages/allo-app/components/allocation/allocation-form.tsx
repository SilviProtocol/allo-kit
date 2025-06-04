"use client";
import { ShoppingCart, XIcon } from "lucide-react";
import { Address, parseUnits, getAddress } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAllocate } from "~/components/allocation/use-allocate";
import { buildAllocations, useCart } from "~/components/cart/use-cart";
import { AllowanceCheck } from "../token/allowance-check";
import { formatNumber } from "~/lib/format";
import { useToken } from "~/components/token/use-token";
import { useProjects } from "../registration/use-register";
import { Grid } from "../grid";
import { AllocationItem } from "./allocation-item";
import { TokenAmount, TokenSymbol } from "../token/token-amount";
import { useEffect } from "react";
import { usePools } from "../pool/use-pool";
import { Registration } from "~/schemas";

export function AllocationForm() {
  const { address } = useAccount();
  const cart = useCart();

  console.log(cart);

  const cartItemsGrouped = Object.keys(cart.items).map((item) => {
    const [address, pool, index, chainId] = item?.split("_");

    console.log(address);
    return {
      pool: pool.toLowerCase(),
      address: address.toLowerCase(),
      chainId,
    };
  });

  const pools = usePools({
    where: {
      address_in: cartItemsGrouped.map((p) => p.pool as Address),
    },
  });
  const projects = useProjects({
    where: {
      pool_in: cartItemsGrouped.map((p) => p.pool as Address),
      address_in: cartItemsGrouped.map((p) => p.address as Address),
    },
  });
  console.log(pools.data?.items);

  const projectsByPool = pools.data?.items.reduce(
    (acc, pool) => {
      acc[pool.address] = projects.data?.items?.filter(
        (p) => p.pool.address === pool.address
      );
      return acc;
    },
    {} as Record<Address, Registration[]>
  );
  console.log(projectsByPool);
  // return <div>checkout</div>;

  // const token = useToken(tokenAddress, address);
  // const allocate = useAllocate({ strategyAddress });
  // const projects = useProjects({
  //   where: {
  //     address_in: Object.keys(cart.items) as Address[],
  //   },
  // });

  useEffect(() => {
    console.log(projects.data?.items);
    if (!projects.data?.items) return;
    // TODO: Make sure the cart items are in the projects
    const missing =
      Object.keys(cart.items).filter(
        (id) => !projects.data?.items.some((p) => p.id === id)
      ) ?? [];

    console.log("missing", missing);
    missing.forEach(cart.remove);
  }, [projects.data?.items]);
  const error = projects.error; //|| allocate.error;

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        // if (!token.data) throw new Error("Token not found");

        const parseRegistrationId = (id: string) => {
          const [address, pool, index] = id.split("_");
          return { address, pool };
        };
        // const allocations = Object.entries(cart.items).reduce(
        //   (acc, [id, allocation]) => {
        //     const { address, pool } = parseRegistrationId(id);
        //     return {
        //       ...acc,
        //       [pool]: [
        //         (acc[pool] ?? []).concat(getAddress(address)),
        //         (acc[pool] ?? []).concat(
        //           parseUnits(
        //             String(allocation ?? 0),
        //             token.data?.decimals ?? 18
        //           )
        //         ),
        //       ],
        //     };

        //     return (allocation ?? 0) > 0
        //       ? [
        //           recipients.concat(getAddress(address)),
        //           amounts.concat(parseUnits(String(allocation ?? 0), decimals)),
        //         ]
        //       : [recipients, amounts];
        //   },
        //   {} as {
        //     [pool: string]: [Address[], bigint[]];
        //   }
        // );

        // console.log(allocations);

        return;
        // const [recipients, amounts] = buildAllocations(
        //   cart.items,
        //   token.data?.decimals
        // );

        // allocate
        //   .mutateAsync([
        //     recipients,
        //     amounts,
        //     tokenAddress,
        //     recipients.map(() => "0x"), // Empty data
        //   ])
        //   .then(() => cart.reset());
      }}
    >
      {pools.data?.items.map((pool) => (
        <div key={pool.id} className="pb-8">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold pb-2">{pool.metadata?.title}</h3>
          </div>
          <Grid
            columns={[1]}
            loadingItems={3}
            isPending={projects.isPending}
            data={projectsByPool[pool.address]}
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
                      value={cart.items[project?.index as Address]}
                      onChange={(e) =>
                        cart.set(
                          project.id,
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
                      onClick={() => cart.remove(project.id)}
                    />
                  </>
                }
              />
            )}
          />
        </div>
      ))}

      {/* <div className="py-4 mt-2 mb-4 border-y sm:flex items-center justify-between">
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
      </div> */}
    </form>
  );
}
