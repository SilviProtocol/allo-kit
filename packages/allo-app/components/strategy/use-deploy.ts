"use client";

import { Address, Hex } from "viem";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { poolFactoryAbi, useWritePoolFactoryDeploy } from "~/generated/wagmi";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { extractErrorReason } from "~/lib/extract-error";
import { useContracts } from "~/hooks/use-contracts";

export function useDeployStrategy() {
  const { PoolFactory } = useContracts();
  const deploy = useWritePoolFactoryDeploy();
  const waitFor = useWaitForEvent(poolFactoryAbi);

  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const hash = await deploy.writeContractAsync(
        { address: PoolFactory.address, args },
        {
          onSuccess: () => toast.success("Created!"),
          onError: (error) =>
            toast.error(extractErrorReason(String(error)) ?? "Create error"),
        }
      );
      return waitFor<{ pool: Address }>(hash, "Deployed");
    },
  });
}
