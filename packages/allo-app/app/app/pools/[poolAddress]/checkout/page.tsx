"use client";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { MintTokens } from "~/components/mint-tokens";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { usePoolById } from "~/components/pool/use-pool";
import { AllocationFormMatching } from "~/components/allocation/allocation-form-matching";

export default function CheckoutPage() {
  const { ERC20Mock } = useContracts();
  const params = useParams();
  const { data } = usePoolById(params.poolAddress as Address);

  const tokenAddress = data?.allocationToken ?? ERC20Mock?.address;
  const poolAddress = data?.address as Address;

  return (
    <Page title="Checkout">
      <p className="pb-4 text-lg">Add amounts to fund projects with.</p>
      {poolAddress ? (
        <AllocationFormMatching
          tokenAddress={tokenAddress}
          poolAddress={poolAddress}
        />
      ) : null}
      <div className="mt-32">
        <MintTokens tokenAddress={tokenAddress} />
      </div>
    </Page>
  );
}
