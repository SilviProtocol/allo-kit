"use client";
import { useAccount } from "wagmi";
import { AllocationsTable } from "~/components/allocation/allocations-table";
import { Page } from "~/components/page";
import { RegistrationsList } from "~/components/registration/registrations-list";

export default function ProfilePage() {
  const { address } = useAccount();

  return (
    <Page
      title="Profile"
      description="Your applications and allocations are shown here."
    >
      <h3 className="pt-4 pb-2 text-lg font-semibold">Applications</h3>
      <RegistrationsList
        query={{
          where: {
            owner_in: [address!],
          },
        }}
      />
      <h3 className="pt-4 pb-2 text-lg font-semibold">Allocations</h3>
      <AllocationsTable
        query={{
          where: {
            from_in: [address!],
          },
        }}
      />
    </Page>
  );
}
