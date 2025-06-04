import { z } from "zod";
import { Address } from "viem";
import { EthAddressSchema } from "~/schemas/address";
import { MetadataSchema } from "~/schemas/metadata";

export const PoolSchema = z.object({
  owner: EthAddressSchema,
  metadata: MetadataSchema,
  allocationToken: EthAddressSchema,
  distributionToken: EthAddressSchema,
  admins: z.array(EthAddressSchema),
  strategy: EthAddressSchema,
  maxAmount: z.coerce.number().default(0).optional(),
  timestamps: z.array(z.number()).default([]).optional(),
  strategyData: z.record(z.string(), z.any()).optional(),
});

export type PoolConfig = {
  owner: Address;
  metadataURI: string;
  allocationToken: Address;
  distributionToken: Address;
  admins: Address[];
  maxAmount: bigint;
  timestamps: bigint[];
};

export type Pool = z.infer<typeof PoolSchema> & {
  address: Address;
  owner: Address;
  chainId: number;
  createdAt: Date;
  updatedAt: Date;
  strategy: {
    name: string;
    address: Address;
  };
  token: {
    name: string;
    address: Address;
  };
  allocationToken: Address;
  distributionToken: Address;
  decodedData: Record<string, unknown>;
};
