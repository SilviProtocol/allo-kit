import gql from "graphql-tag";
import { META_SCHEMA } from "~/queries";

export const POOLS_SCHEMA = gql`
  query Pools(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: poolFilter
  ) {
    pools(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
        chainId
        address
        owner
        admins
        allocationToken
        distributionToken
        maxAmount
        timestamps
        strategy {
          address
          name
          metadata
        }
        metadata
        createdAt
        updatedAt
      }
      ${META_SCHEMA}
    }
  }
`;
