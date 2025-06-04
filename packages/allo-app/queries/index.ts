import gql from "graphql-tag";

export const META_SCHEMA = `
    totalCount
    pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
    }
`;

export const ALLOCATIONS_SCHEMA = gql`
  query Allocations(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: allocationFilter
  ) {
    allocations(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
        id
        chainId
        amount
        to
        from
        token
        createdAt
        registration {
          address
          metadata
        }
        pool { 
          address
          metadata
        }
      }
      ${META_SCHEMA}
    }
  }
`;
