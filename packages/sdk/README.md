# Commit Protocol SDK

Commit Protocol comes with an SDK for easier integration and building custom apps and frontends.

```tsx
import { CommitSDK } from "@commit-labs/sdk";

const clientConfig = { recipient: "0x...", shareBps: 100n }; // 1%
const commitSDK = new CommitSDK(viemClient, chainId, clientConfig);

const toSeconds = (d: Date) => BigInt(Math.floor(d.getTime() / 1000));

// Create Commit
const { commitId } = await commitSDK.create({
  creator: "0x...",
  metadataURI: "ipfsCid",
  token: "0xTokenAddress" || zeroAddress,
  stake: parseUnits(10, decimals),
  fee: parseUnits(1, decimals), // 1 USDC to creator when participants join
  joinBefore: toSeconds(new Date("2025-07-01")),
  verifyBefore: toSeconds(new Date("2025-12-31")),
  maxParticipants: 0,
  fulfillVerifier: {
    type: "SignatureVerifier", // TokenVerifier | EASVerifier | CommitVerifier | CustomVerifier
    data: { signer: "0x03bd5646b4cea1ed6599e47d9fed1a46406c8236" },
  },
  joinVerifier: undefined, // (Optional) Used to verify participants before joining
});

// Commits can be funded with approved tokens
await commit.fund(commitId, "0xFundingToken", parseUnits(amount, decimals));
await commit.withdraw(commitId, "0xFundingToken");

// Participant flows
await commit.join(commitId, "");
// Verify data is created by a trusted API endpoint
const verifyData = { commitId, timestamp, signature };
await commit.verify(commitId, participant, verifyData);
await commit.claim(commitId, participant);

// Creator claim fees
await commit.claimFees("0xTokenAddress");

// Creator can cancel the commit before verify date
await commit.cancel(commitId);
await commit.refund(commitId);

await commit.getApprovedTokens();
await commit.getProtocolConfig();
await commit.getClaims(address);
```

## Usage with React

Create a Provider and use in `layout.tsx`

```tsx
// layout.tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.className}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <CommitProvider>{children}</CommitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

// commit-provider.tsx
import { CommitSDK } from "@commit-labs/sdk";

export const CommitSDKContext = createContext<CommitSDK | null>(null);

function CommitProvider({ children }: PropsWithChildren) {
  const sdk = useSDK();
  return (
    <CommitSDKContext.Provider value={sdk}>
      {children}
    </CommitSDKContext.Provider>
  );
}
export function useCommitSDK() {
  return useContext(CommitSDKContext);
}
function useSDK() {
  const { data: client } = useWalletClient();
  const chainId = useChainId();
  const clientConfig = { recipient: "0x...", shareBps: 100n }; // 1%
  return useMemo(
    () =>
      client && chainId ? new CommitSDK(client, chainId, clientConfig) : null,
    [client, chainId]
  );
}

// hooks/use-create-commit.ts
export function useCreateCommit() {
  const sdk = useCommitSDK();
  return useMutation({
    mutationFn: async (config: CommitInput) => sdk?.create(config),
  });
}
```
