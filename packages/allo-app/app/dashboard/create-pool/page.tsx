"use client";

import { Page } from "~/components/page";
import { PoolForm } from "~/components/pool/pool-form";
import { useStrategies } from "~/components/strategy/use-strategy";
import { useContracts } from "~/hooks/use-contracts";
import { useToken } from "~/components/token/use-token";
import { useAccount } from "wagmi";

export default function CreatePool() {
  const { address } = useAccount();
  const { ERC20Mock } = useContracts();
  const { data: strategies, isPending } = useStrategies({
    limit: 100,
  });
  const { data: token } = useToken(ERC20Mock?.address);
  const tokens = token ? [token] : [];

  return (
    <Page title="Create Pool">
      {isPending ? (
        <>loading...</>
      ) : (
        <PoolForm
          strategies={strategies?.items ?? []}
          tokens={tokens}
          defaultValues={{
            metadata: {
              title: "My Pool",
              image: "",
              description: "My Pool Description",
            },
            owner: address,
            strategy: strategies?.items[0]?.address,
            allocationToken: ERC20Mock?.address,
            distributionToken: ERC20Mock?.address,
            strategyData: {},
            maxAmount: 10000,
            admins: [],
          }}
        />
      )}
    </Page>
  );
}
