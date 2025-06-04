"use client";

import { Hex } from "viem";
import { Button } from "~/components/ui/button";
import { useRegistrationById, useRegistryApprove } from "./use-register";
import { useInvalidate } from "~/hooks/use-invalidate";
import { Badge } from "../ui/badge";

export function RegistrationApproveButton({ id }: { id: Hex }) {
  const { data: registration, isPending, queryKey } = useRegistrationById(id);
  const invalidate = useInvalidate();

  console.log("Approve button", registration);
  const approve = useRegistryApprove({
    strategyAddress: registration?.pool?.address!,
  });
  if (isPending) return null;
  if (registration?.isApproved)
    return <Badge variant="success">Approved</Badge>;

  const reviewMetadataIpfs = "";
  return (
    <Button
      variant="outline"
      isLoading={approve.isPending}
      onClick={() =>
        approve
          .mutateAsync([registration?.address!, reviewMetadataIpfs, "0x"])
          .then(() => invalidate([queryKey]))
      }
    >
      Approve
    </Button>
  );
}
