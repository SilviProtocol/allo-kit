"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { ApplicationsTable } from "~/components/registration/applications-table";
import { RegistrationReviewButton } from "~/components/registration/approve-button";

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
            <RegistrationReviewButton id={registration.id} />
            <Link
              target="_blank"
              href={`/app/pools/${poolAddress}/registrations/${registration.address}`}
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
