"use client";

import { Hex } from "viem";
import { Button } from "~/components/ui/button";
import { useRegistrationById, useRegistryReview } from "./use-register";
import { useInvalidate } from "~/hooks/use-invalidate";

export function RegistrationReviewButton({ id }: { id: Hex }) {
  const { data: registration, isPending, queryKey } = useRegistrationById(id);
  const invalidate = useInvalidate();

  const review = useRegistryReview(registration?.pool?.address!);

  if (isPending) return null;
  function handleReview(status: number) {
    const reviewMetadataIpfs = "";
    review
      .mutateAsync([registration?.address!, status, reviewMetadataIpfs, "0x"])
      .then(() => invalidate([queryKey]));
  }
  if (registration?.status === "approved")
    return (
      <Button
        variant="destructive"
        isLoading={review.isPending}
        onClick={() => handleReview(2)}
      >
        Reject
      </Button>
    );

  return (
    <Button
      variant="outline"
      isLoading={review.isPending}
      onClick={() => handleReview(1)}
    >
      Approve
    </Button>
  );
}
