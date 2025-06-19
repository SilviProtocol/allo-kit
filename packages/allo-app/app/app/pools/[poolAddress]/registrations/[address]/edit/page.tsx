"use client";
import { useAccount } from "wagmi";
import { Page } from "~/components/page";
import { useParams, useRouter } from "next/navigation";
import { Address } from "viem";
import { useRegistration } from "~/components/registration/use-register";
import { RegistrationEditForm } from "~/components/registration/registration-edit-form";

export default function RegistrationEditPage() {
  const params = useParams();
  const router = useRouter();
  const account = useAccount();
  const address = params.address as Address;
  const poolAddress = params.poolAddress as Address;
  const { data: application, isPending } = useRegistration({
    address,
    poolAddress,
    owner: account?.address as Address,
  });

  return (
    <Page
      title="Edit Application"
      backLink={`/app/pools/${poolAddress}/registrations/${address}`}
    >
      {isPending ? (
        <div>Loading...</div>
      ) : application ? (
        <RegistrationEditForm
          poolAddress={poolAddress}
          defaultValues={application}
          onSuccess={({ project }) =>
            router.push(`/app/pools/${poolAddress}/registrations/${project}`)
          }
        />
      ) : (
        <div>Application not found</div>
      )}
    </Page>
  );
}
