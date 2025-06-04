"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { Page } from "~/components/page";
import { ApplicationsList } from "~/components/registration/applications-list";
import { Button } from "~/components/ui/button";
import { ApplicationsTable } from "~/components/registration/applications-table";
import { ApproveItem } from "~/components/registration/approve-item";
import { RegistrationApproveButton } from "~/components/registration/approve-button";

export default function DashboardApplicationsPage() {
  const { poolAddress } = useParams();
  return (
    <Page title={`Applications`}>
      <ApplicationsTable
        query={{
          where: {
            pool_in: [poolAddress as Address],
          },
        }}
        renderLink={(registration) => (
          <div className="flex justify-end">
            <RegistrationApproveButton id={registration.id} />
            <Link
              href="#"
              // href={`/dashboard/${poolAddress}/applications/${registration.id}`}
            >
              <Button variant="link" iconRight={ArrowRight}>
                View
              </Button>
            </Link>
          </div>
        )}
      />
      {/* <ApplicationsList
        query={{
          where: {
            pool_in: [poolAddress as Address],
          },
        }}
      /> */}
    </Page>
  );
}
