import gql from "graphql-tag";

export const STRATEGIES_QUERY = gql`
  query Strategies(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: strategyFilter
  ) {
    strategys(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
        name
        address
        schema
        createdAt
      }
    }
  }
`;
