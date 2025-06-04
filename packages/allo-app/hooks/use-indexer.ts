"use client";

import { useQuery } from "@tanstack/react-query";
import { OperationResult, TypedDocumentNode } from "urql";
import { Address, Hex } from "viem";
import { createClient } from "~/lib/graphql";
import { useCurrentChainName } from "./use-current-chain";
import { chains } from "~/config";

export type RegistrationWhere = {
  id?: Hex;
  index?: number;
  address_in?: Address[];
  strategy_in?: Address[];
  isApproved?: boolean;
  pool_in?: Address[];
  chainId_in?: number[];
};
type AllocationWhere = {
  amount_gt?: number;
  amount_lt?: number;
  from_in?: Address[];
  from_not_in?: Address[];
  to_in?: Address[];
  to_not_in?: Address[];
  tokenAddress_in?: Address[];
  strategy_in?: Address[];
};
type PoolWhere = {
  address?: Address;
  address_in?: Address[];
  pool_in?: Address[];
  owner_in?: Address[];
};

export type IndexerQuery = {
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  where?: RegistrationWhere | AllocationWhere | PoolWhere;
};

const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL!;

export function useIndexer<T extends { createdAt?: Date; updatedAt?: Date }>({
  queryKey,
  queryFn,
  query,
  variables,
  enabled = true,
  maxRetries = 5,
  retryTimeout = 10000,
  ...rest
}: {
  queryKey: unknown[];
  queryFn: (r: OperationResult["data"]) => Promise<{
    items: T[];
    totalCount: number;
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
    };
  }>;
  query: TypedDocumentNode;
  variables: IndexerQuery;
  enabled?: boolean;
  refetchInterval?: number;
  maxRetries?: number;
  retryTimeout?: number;
}) {
  const network = useCurrentChainName();
  const chainId = chains[network as keyof typeof chains]?.id;
  const client = createClient(indexerUrl);
  const res = useQuery({
    enabled: !!client && enabled,
    queryKey: [...queryKey, network],
    queryFn: async () => {
      return client
        ?.query(query, {
          ...variables,
          where: {
            chainId,
            ...variables.where,
          },
        })
        .toPromise()
        .then((r) => {
          console.log(r);
          if (r.error) throw new Error(r.error.message);
          return queryFn(r.data);
        });
    },
    select: (data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        createdAt: item.createdAt
          ? new Date(Number(item.createdAt))
          : undefined,
        updatedAt: item.updatedAt
          ? new Date(Number(item.updatedAt))
          : undefined,
      })),
    }),
    refetchInterval: ({ state }) => {
      // Stop refetching if we have data or if we've hit the retry limit
      return (state.data?.items?.length ?? 0) > 0 ? 0 : 1000;
    },
    retry: 5, // Will retry failed requests 5 times
    retryDelay: 1000, // Wait 1 second between retries
    ...rest,
  });

  return { ...res, queryKey };
}
