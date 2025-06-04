"use client";

import { useWalletClient } from "wagmi";
import { Abi, type Hex, parseEventLogs } from "viem";
import { getTransactionReceipt } from "viem/actions";
import pRetry from "p-retry";

export function useWaitForEvent(abi: Abi) {
  const { data: client } = useWalletClient();
  return <T>(hash: Hex, eventName: string): Promise<T> => {
    if (!client) throw new Error("WalletClient not found");
    return pRetry(
      () =>
        getTransactionReceipt(client, { hash })
          .then(({ logs }) => parseEventLogs({ abi, logs, eventName }))
          .then((logs) => {
            console.log(logs);
            return logs;
          })
          .then((events) => events?.[0]?.args as T),
      { retries: 5 }
    );
  };
}
