import { Address, Chain } from "viem";
import { Client, Transport, Account } from "viem";

export interface PoolConfig {
  owner: Address;
  admins: Address[];
  allocationToken: Address;
  distributionToken: Address;
  maxAmount: bigint;
  timestamps: bigint[];
  metadataURI: string;
}

export interface Registration {
  status: "pending" | "approved" | "rejected";
  owner: Address;
  metadataURI: string;
  data: string;
}

export interface ClientConfig {
  recipient: Address;
  shareBps: bigint;
}

export interface CommitInput {
  joinVerifier?: {
    type: string;
    data: any;
  };
  fulfillVerifier: {
    type: string;
    data: any;
  };
  config: PoolConfig;
  data?: string;
}

export type WalletClient = Client<Transport, Chain, Account>;
