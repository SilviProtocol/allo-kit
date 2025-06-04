// import { Abi, Address, zeroAddress, parseEventLogs, erc20Abi } from "viem";
import type { Account, Chain, Client, Transport } from "viem";
// import {
//   readContract,
//   simulateContract,
//   writeContract,
//   waitForTransactionReceipt,
// } from "viem/actions";
// import deployedContracts from "../contracts/deployedContracts";

export type WalletClient = Client<Transport, Chain, Account>;

export * from "./utils";

// type PoolInput = {
//   metadata: {
//     name: string;
//     description: string;
//     image: string;
//   };
// };

// type Pool = {
//   id: bigint;
//   name: string;
//   description: string;
//   createdAt: bigint;
//   updatedAt: bigint;
// };
export class AlloKitSDK {
  // #client: WalletClient;
  // #chainId: keyof typeof deployedContracts;
  // #contracts: (typeof deployedContracts)[31337];
  // constructor(client: WalletClient, chainId: number) {
  //   this.#client = client;
  //   this.#chainId = chainId as keyof typeof deployedContracts;
  //   this.#contracts = deployedContracts[this.#chainId];
  // }
  // get pools() {
  //   const executeTransaction = this.#executeTransaction;
  //   const contracts = this.#contracts;
  //   return {
  //     async create(strategy: Address, data: PoolInput): Promise<bigint> {
  //       return executeTransaction({
  //         abi: contracts.StrategyFactory.abi,
  //         address: contracts.StrategyFactory.address,
  //         functionName: "deploy",
  //         args: [strategy, data],
  //         eventName: "Deployed",
  //       });
  //     },
  //     query: this.query,
  //     register: this.register,
  //     allocate: this.allocate,
  //     distribute: this.distribute,
  //   };
  // }
  // async query(): Promise<Pool[]> {
  //   return [];
  // }
  // async register(
  //   poolId: bigint,
  //   project: Address,
  //   index: number
  // ): Promise<bigint> {
  //   return 0n;
  // }
  // async allocate(
  //   poolId: bigint,
  //   to: Address,
  //   amount: bigint,
  //   token: Address
  // ): Promise<bigint> {
  //   return 0n;
  // }
  // async distribute(
  //   poolId: bigint,
  //   to: Address,
  //   amount: bigint,
  //   token: Address
  // ): Promise<bigint> {
  //   return 0n;
  // }
  // async #executeTransaction<T = any>({
  //   abi,
  //   address,
  //   functionName,
  //   args,
  //   value,
  //   eventName,
  // }: {
  //   abi: Abi;
  //   address: Address;
  //   functionName: string;
  //   args?: any[];
  //   value?: bigint;
  //   eventName: string;
  // }): Promise<T> {
  //   const { request } = await simulateContract(this.#client, {
  //     abi,
  //     address,
  //     functionName,
  //     args,
  //     value,
  //   });
  //   const hash = await writeContract(this.#client, request);
  //   const receipt = await waitForTransactionReceipt(this.#client, { hash });
  //   const logs = parseEventLogs({
  //     abi,
  //     logs: receipt.logs,
  //   });
  //   const event = logs.find((log) => log.eventName === eventName);
  //   return event?.args as T;
  // }
  // extend(): this {
  //   return this;
  // }
}
