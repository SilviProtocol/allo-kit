"use client";

import Link from "next/link";
import { IndexerQuery } from "~/hooks/use-indexer";
import { Columns, Grid } from "../grid";
import { usePools } from "./use-pool";
import { PoolCard } from "./pool-card";

export function PoolList({
  columns = [1, 2, 2, 3],
  query,
}: {
  columns?: Columns;
  query: IndexerQuery;
}) {
  const { data, error, isPending } = usePools(query);

  return (
    <Grid
      columns={columns}
      data={data?.items}
      error={error}
      isPending={isPending}
      renderItem={(pool) => {
        return (
          <Link href={`/app/pools/${pool?.address}`} prefetch>
            <PoolCard {...pool} key={pool.address} />
          </Link>
        );
      }}
    />
  );
}
