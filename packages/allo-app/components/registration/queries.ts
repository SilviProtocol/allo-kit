import gql from "graphql-tag";

import { META_SCHEMA } from "~/queries";

export const REGISTRATIONS_SCHEMA = gql`
  query Registrations(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: registrationFilter
  ) {
    registrations(
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
        address
        metadata
        review
        createdAt
        updatedAt
        isApproved    
        allocations {
          items {
            id
            amount
            to
            from
            token
            createdAt
          }
        }
        strategy {
          address
          name
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
