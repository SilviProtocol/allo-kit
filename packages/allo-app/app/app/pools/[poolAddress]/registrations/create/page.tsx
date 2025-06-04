"use client";
import { useAccount } from "wagmi";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { RegistrationForm } from "~/components/registration/registration-form";
import { useRouter } from "next/navigation";

export default function ProjectRegisterPage() {
  const router = useRouter();
  const { SimpleGrants } = useContracts();
  const { address } = useAccount();

  return (
    <Page title="Register Project">
      <RegistrationForm
        strategyAddress={SimpleGrants?.address}
        defaultValues={{
          address,
          metadata: {
            title: "Grant Project",
            image: undefined,
            description: `This is a project...`,
          },
        }}
        onSuccess={({ project }) =>
          router.push(`/app/project/${project.toLowerCase()}`)
        }
      />
    </Page>
  );
}
