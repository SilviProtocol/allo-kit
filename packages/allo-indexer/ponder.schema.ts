import { onchainTable, relations } from "ponder";

export const strategy = onchainTable("strategy", (t) => ({
  chainId: t.integer().notNull(),
  address: t.hex().primaryKey(),
  creator: t.hex().notNull(),
  name: t.text(),
  schema: t.text(),
  metadataURI: t.text(),
  metadata: t.json(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

export const pool = onchainTable("pool", (t) => ({
  chainId: t.integer().notNull(),
  address: t.hex().primaryKey(),
  owner: t.hex().notNull(),
  // name: t.text(),
  // schema: t.text(),
  // data: t.hex(),
  strategy: t.hex().notNull(),
  // decodedData: t.json(),
  metadataURI: t.text(),
  allocationToken: t.hex().notNull(),
  distributionToken: t.hex().notNull(),
  admins: t.text().array(),
  maxAmount: t.bigint().notNull(),
  timestamps: t.bigint().array(),
  metadata: t.json(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

export const registration = onchainTable("registration", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  address: t.hex().notNull(),
  // index: t.integer().notNull(),
  owner: t.hex().notNull(),
  approver: t.hex(),
  strategy: t.hex().notNull(),
  pool: t.hex().notNull(),
  data: t.hex().notNull(),
  metadataURI: t.text().notNull(),
  metadata: t.json(),
  review: t.json(),
  isApproved: t.boolean().notNull(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

export const allocation = onchainTable("allocation", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  strategy: t.hex().notNull(),
  pool: t.hex().notNull(),
  to: t.hex().notNull(),
  from: t.hex().notNull(),
  amount: t.bigint().notNull(),
  amountInUSD: t.bigint().notNull(),
  tokenAddress: t.hex().notNull(),
  token: t.json(),
  createdAt: t.bigint().notNull(),
}));

export const registrationRelations = relations(
  registration,
  ({ one, many }) => ({
    strategy: one(strategy, {
      fields: [registration.strategy],
      references: [strategy.address],
    }),
    pool: one(pool, {
      fields: [registration.pool],
      references: [pool.address],
    }),
    allocations: many(allocation),
  })
);

export const poolRelations = relations(pool, ({ one, many }) => ({
  allocations: many(allocation),
  strategy: one(strategy, {
    fields: [pool.strategy],
    references: [strategy.address],
  }),
}));

export const allocationRelations = relations(allocation, ({ one }) => ({
  registration: one(registration, {
    fields: [allocation.to],
    references: [registration.address],
  }),
  strategy: one(strategy, {
    fields: [allocation.strategy],
    references: [strategy.address],
  }),
  pool: one(pool, {
    fields: [allocation.pool],
    references: [pool.address],
  }),
}));

export const strategyRelations = relations(strategy, ({ one, many }) => ({
  allocations: many(allocation),
  registrations: many(registration),
}));
