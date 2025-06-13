# AlloKit SDK

```tsx
import { AlloKitSDK } from "@allo-kit/sdk";

const alloKitSDK = new AlloKitSDK(viemClient, chainId);

// Deploy a new pool
const { pool } = await alloKitSDK.deployPool(
  "0x...", // owner address
  {
    // pool configuration
    metadataURI: "ipfsCid",
    // ... other config options
  }
);

// Register a project
await alloKitSDK.register(pool, "0xProjectAddress", "ipfsCid");

// Review a project (0: Rejected, 1: Pending, 2: Approved)
await alloKitSDK.review(pool, "0xProjectAddress", 2, "ipfsCid");

// Update project metadata
await alloKitSDK.update(pool, "0xProjectAddress", "newIpfsCid");

// Allocate funds to recipients
await alloKitSDK.allocate(
  pool,
  ["0xRecipient1", "0xRecipient2"],
  [parseUnits("100", 18), parseUnits("200", 18)],
  "0xTokenAddress"
);

// Distribute funds to recipients
await alloKitSDK.distribute(
  pool,
  ["0xRecipient1", "0xRecipient2"],
  [parseUnits("100", 18), parseUnits("200", 18)],
  "0xTokenAddress"
);
```
