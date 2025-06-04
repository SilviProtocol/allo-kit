"use client";
import { useEffect } from "react";
import { Address, getAddress, parseUnits } from "viem";
import { createGlobalState } from "~/hooks/use-global-state";
import { Registration } from "~/schemas";

type CartItem = Record<string, bigint | undefined>;
const useCartState = createGlobalState<CartItem>(
  JSON.parse(global.localStorage?.getItem("cart") ?? "{}")
);

export function useCart() {
  // Initialize cart state from localStorage, defaulting to an empty object
  const [items, setCart] = useCartState();

  // Update or remove an item in the cart (undefined removes)
  const set = (id: string, allocation?: bigint) =>
    setCart((state) => ({ ...state, [id]: allocation }));

  const remove = (id: string) => {
    const { [id]: exists, ...rest } = items ?? {};
    setCart(rest);
  };

  // Check if the cart contains a valid allocation for a specific item
  const contains = (id: string) => id in items && typeof items[id] === "number";

  // Clear all items from the cart
  const reset = () => setCart({});

  // Get a list of all item IDs with valid allocations
  const list = Object.keys(items).filter((id) => typeof items[id] === "number");

  // Sum the cart allocations
  const sum = Object.values(items).reduce(
    (sum, x) => (x ? (BigInt(sum ?? 0) ?? 0n) + BigInt(x) : sum),
    0n
  );
  // Persist cart state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return { items, contains, set, reset, sum, list, remove };
}

// Registration IDs are a composite of project address, pool, applicationIndex, and chainId
const registrationId = ({ address, pool, index, chainId }: Registration) =>
  `${getAddress(address)}_${getAddress(pool.address)}_${index}_${chainId}`;

const parseRegistrationId = (id: string) => {
  const [address, pool, index, chainId] = id.split("_");
  return {
    address: address as Address,
    pool: pool as Address,
    index: Number(index),
    chainId: Number(chainId),
  };
};
export function usePruneCart(projects?: Registration[]) {
  const cart = useCart();
  useEffect(() => {
    if (!projects) return;
    // Make sure the cart items are in the projects
    const missing =
      Object.keys(cart.items).filter(
        (item) => !projects.some((p) => registrationId(p) === item)
      ) ?? [];

    // Remove cart items that doesn't exist as projects
    missing.forEach(cart.remove);
  }, [projects, cart.items]);
}

export function cartItemsToIds(items: CartItem) {
  return Object.keys(items).reduce<{
    pools: Address[];
    ids: Address[];
    chainIds: number[];
  }>(
    (acc, item) => {
      const { address, pool, chainId } = parseRegistrationId(item);
      const chainIdNum = Number(chainId);

      return {
        ids: [...acc.ids, address as Address],
        pools: [...acc.pools, pool as Address],
        chainIds: acc.chainIds.includes(chainIdNum)
          ? acc.chainIds
          : [...acc.chainIds, chainIdNum],
      };
    },
    { pools: [], ids: [], chainIds: [] }
  );
}

// Build arrays of recipients and parsed token amounts
export function buildAllocations(
  cartItems: CartItem,
  decimals = 18
): [Address[], bigint[]] {
  return Object.entries(cartItems).reduce(
    ([recipients, amounts], [id, allocation]) =>
      (allocation ?? 0) > 0
        ? [
            recipients.concat(parseRegistrationId(id).address),
            amounts.concat(parseUnits(String(allocation ?? 0), decimals)),
          ]
        : [recipients, amounts],
    [[], []] as [Address[], bigint[]]
  );
}
