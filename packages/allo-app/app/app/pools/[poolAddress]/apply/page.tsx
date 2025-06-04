"use client";
import { useAccount } from "wagmi";
import { Page } from "~/components/page";
import { RegistrationForm } from "~/components/registration/registration-form";
import { useParams, useRouter } from "next/navigation";
import { Address } from "viem";

export default function PoolApplyPage() {
  const params = useParams();
  const poolAddress = params.poolAddress as Address;
  const router = useRouter();
  const { address } = useAccount();

  return (
    <Page title="Apply to Pool">
      <RegistrationForm
        strategyAddress={poolAddress}
        defaultValues={{
          address,
          metadata: {
            title: "Grant Project",
            image: undefined,
            description: `This is a project...`,
          },
        }}
        onSuccess={({ project }) =>
          router.push(`/app/pools/${poolAddress}/registrations/${project}`)
        }
      />
    </Page>
  );
}
