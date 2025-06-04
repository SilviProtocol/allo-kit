"use client";

import { useCart } from "~/components/cart/use-cart";
import { IndexerQuery } from "~/hooks/use-indexer";
import { Grid } from "../grid";
import { RegistrationCard } from "./registration-card";
import { useRegistrations } from "./use-register";
import Link from "next/link";

export function RegistrationsList({ query }: { query: IndexerQuery }) {
  const cart = useCart();
  const { data, error, isPending } = useRegistrations(query);

  console.log(data?.items);

  return (
    <Grid
      columns={[1, 2, 3, 4]}
      data={data?.items}
      error={error}
      isPending={isPending}
      renderItem={(project) => (
        <Link
          href={`/app/pools/${project.pool?.address}/registrations/${project.address}`}
        >
          <RegistrationCard
            {...project}
            key={project.id}
            inCart={cart.contains(project.id)}
            onSelect={() =>
              cart.contains(project.id)
                ? cart.remove(project.id)
                : cart.set(project.id, 1)
            }
          />
        </Link>
      )}
    />
  );
}
