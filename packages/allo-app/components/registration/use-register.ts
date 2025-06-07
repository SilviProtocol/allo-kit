"use client";

import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import {
  poolAbi,
  useWritePoolRegister,
  useWritePoolReview,
} from "~/generated/wagmi";
import { extractErrorReason } from "~/lib/extract-error";
import { Registration } from "~/schemas";
import { IndexerQuery, useIndexer } from "~/hooks/use-indexer";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { toast } from "sonner";
import { REGISTRATIONS_SCHEMA } from "./queries";

// Register a Project or Application
// calls contract Registry.register
export function useRegister({ strategyAddress }: { strategyAddress: Address }) {
  const register = useWritePoolRegister();

  const waitFor = useWaitForEvent(poolAbi);

  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const hash = await register.writeContractAsync(
        { address: strategyAddress, args },
        {
          onSuccess: () => toast.success("Project Registered!"),
          onError: (error) =>
            toast.error(
              extractErrorReason(String(error)) ?? "Register Project error"
            ),
        }
      );
      return waitFor<{ project: string }>(hash, "Register");
    },
  });
}

// Approve Project or Application
// calls Registry.review
export function useRegistryReview({
  strategyAddress,
}: {
  strategyAddress: Address;
}) {
  const review = useWritePoolReview({});

  const waitFor = useWaitForEvent(poolAbi);

  return useMutation({
    mutationFn: async (args: [Address, number, string, Hex]) => {
      const hash = await review.writeContractAsync(
        { address: strategyAddress, args },
        {
          onSuccess: () => toast.success("Registration reviewed!"),
          onError: (error) =>
            toast.error(extractErrorReason(String(error)) ?? "Review error"),
        }
      );
      return waitFor(hash, "Review");
    },
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
}: {
  address: Address;
  poolAddress: Address;
}) {
  const { data, ...rest } = useRegistrations({
    where: { address, pool_in: [poolAddress] },
  });
  return { ...rest, data: data?.items?.[0] };
}
export function useRegistrationById(id: Hex) {
  const { data, ...rest } = useRegistrations({ where: { id } });
  return { ...rest, data: data?.items?.[0] };
}
