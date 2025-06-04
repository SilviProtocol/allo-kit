"use client";
import { Page } from "~/components/page";
import { useStrategies } from "~/components/strategy/use-strategy";
import { Grid } from "~/components/grid";
import { useContracts } from "~/hooks/use-contracts";

export default function Strategies() {
  const { data, error, isPending } = useStrategies({});

  const contracts = useContracts();

  return (
    <Page title="Strategies">
      <Grid
        columns={[1]}
        data={data?.items.filter((s) => s.name)}
        error={error}
        isPending={isPending}
        renderItem={(strategy) => {
          const contract = Object.values(contracts).find((c) => {
            return c.address.toLowerCase() === strategy.address?.toLowerCase();
          });
          const extensions = Object.keys(
            contract?.inheritedFunctions ?? {}
          ).filter((fn) => !["id", "schema"].includes(fn));
          console.log(extensions);
          return (
            <div key={strategy.address} className="border-b py-2">
              <h3 className="">{strategy.name}</h3>
              <div className="">{strategy.address}</div>
              <pre className="text-xs whitespace-pre-wrap">
                {extensions.join(", ")}
              </pre>
            </div>
          );
        }}
      />
    </Page>
  );
}
