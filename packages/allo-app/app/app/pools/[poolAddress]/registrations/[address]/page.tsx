"use client";

import { Address, Hex } from "viem";

import { useParams, useRouter } from "next/navigation";
import { BackgroundImage } from "~/components/background-image";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";

import { useCart } from "~/components/cart/use-cart";
import { AllocationsTable } from "~/components/allocation/allocations-table";
import { Markdown } from "~/components/markdown";
import { ApprovedBadge } from "~/components/registration/approved-badge";
import { useRegistration } from "~/components/registration/use-register";
import { Pencil } from "lucide-react";
import { useAccount } from "wagmi";
import Link from "next/link";

function AddToCartButton({ id }: { id: string }) {
  // TODO: Check if project is approved
  const cart = useCart();
  const router = useRouter();
  const { poolAddress } = useParams();
  return (
    <Button
      onClick={() => {
        cart.set(id, cart.items[id] || 1);
        router.push(`/app/pools/${poolAddress}/checkout`);
      }}
    >
      Add To Cart
    </Button>
  );
}

function EditProjectButton({
  id,
  poolAddress,
}: {
  id: string;
  poolAddress: Address;
}) {
  return (
    <Link href={`/app/pools/${poolAddress}/registrations/${id}/edit`}>
      <Button variant="outline" icon={Pencil}>
        Edit Project
      </Button>
    </Link>
  );
}

export default function RegistrationDetailsPage() {
  const params = useParams();
  const account = useAccount();
  const address = params.address as Address;
  const poolAddress = params.poolAddress as Address;
  const { data: project } = useRegistration({
    address,
    poolAddress,
  });

  return (
    <Page
      title={
        <div className="flex gap-2 items-center">
          {project?.metadata?.title!} <ApprovedBadge status={project?.status} />
        </div>
      }
      actions={
        <>
          {project?.status === "approved" && (
            <AddToCartButton id={project?.id!} />
          )}
          {account?.address?.toLowerCase() ===
            project?.owner?.toLowerCase() && (
            <EditProjectButton id={project?.id!} poolAddress={poolAddress} />
          )}
        </>
      }
    >
      <BackgroundImage
        src={project?.metadata.image}
        className="h-40 bg-gray-200"
      />
      <div className="py-8">
        <Markdown>{project?.metadata.description}</Markdown>
      </div>

      <h3 className=" font-semibold">Allocations</h3>
      <AllocationsTable
        query={{
          orderBy: "createdAt",
          orderDirection: "desc",
          where: { to_in: [address] },
        }}
      />
    </Page>
  );
}
