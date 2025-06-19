"use client";

import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { extractErrorReason } from "~/lib/extract-error";
import { Registration } from "~/schemas";
import { IndexerQuery, useIndexer } from "~/hooks/use-indexer";
import { toast } from "sonner";
import { REGISTRATIONS_SCHEMA } from "./queries";
import { useAlloKitSDK } from "~/app/providers-sdk";

// Register a Project or Application
// calls contract Registry.register
export function useRegister(poolAddress: Address) {
  const sdk = useAlloKitSDK();
  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const [project, metadataURI, data] = args;
      return sdk?.register(poolAddress, project, metadataURI, data);
    },
    onSuccess: () => toast.success("Registered!"),
    onError: (error) =>
      toast.error(extractErrorReason(String(error)) ?? "Register error"),
  });
}

export function useUpdateRegistration(poolAddress: Address) {
  const sdk = useAlloKitSDK();
  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const [project, metadataURI, data] = args;
      return sdk?.update(poolAddress, project, metadataURI, data);
    },
    onSuccess: () => toast.success("Updated!"),
    onError: (error) =>
      toast.error(extractErrorReason(String(error)) ?? "Update error"),
  });
}

// Approve Project or Application
// calls Registry.review
export function useRegistryReview(poolAddress: Address) {
  const sdk = useAlloKitSDK();
  return useMutation({
    mutationFn: async (args: [Address, string, 0 | 1 | 2, Hex]) => {
      const [project, metadataURI, status, data] = args;
      return sdk?.review(poolAddress, project, status, metadataURI, data);
    },
    onSuccess: () => toast.success("Reviewed!"),
    onError: (error) =>
      toast.error(extractErrorReason(String(error)) ?? "Review error"),
  });
}

// Query created Projects and Applications
// emitted Register events
export function useRegistrations(variables: IndexerQuery) {
  return useIndexer<Registration>({
    queryKey: ["registrations", variables],
    variables,
    query: REGISTRATIONS_SCHEMA,
    queryFn: async (r) => r?.registrations,
  });
}
export function useRegistration({
  address,
  poolAddress,
  owner,
}: {
  address: Address;
  poolAddress: Address;
  owner?: Address;
}) {
  const { data, ...rest } = useRegistrations({
    where: {
      address,
      pool_in: [poolAddress],
      owner_in: owner ? [owner] : undefined,
    },
  });
  return { ...rest, data: data?.items?.[0] };
}
export function useRegistrationById(id: Hex) {
  const { data, ...rest } = useRegistrations({ where: { id } });
  return { ...rest, data: data?.items?.[0] };
}
