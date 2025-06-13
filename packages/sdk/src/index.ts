import {
  Abi,
  Address,
  createPublicClient,
  Hex,
  http,
  parseEventLogs,
} from "viem";
import {
  writeContract,
  waitForTransactionReceipt,
  simulateContract,
} from "viem/actions";
import deployedContracts from "../contracts/deployedContracts";
import { PoolConfig, WalletClient } from "./types";

type Pool = (typeof deployedContracts)[31337]["Pool"];
type PoolFactory = (typeof deployedContracts)[31337]["PoolFactory"];

export class AlloKitSDK {
  readonly #client: WalletClient;
  readonly #chainId: keyof typeof deployedContracts;
  readonly #pool: Pool;
  readonly #poolFactory: PoolFactory;
  readonly #rpcUrls: Record<number, string>;

  constructor(
    client: WalletClient,
    chainId: number,
    rpcUrls: Record<number, string> = {}
  ) {
    this.#client = client;
    this.#chainId = chainId as keyof typeof deployedContracts;
    this.#pool = (deployedContracts[this.#chainId] as any)?.Pool as Pool;
    this.#poolFactory = (deployedContracts[this.#chainId] as any)
      ?.PoolFactory as PoolFactory;
    this.#rpcUrls = rpcUrls;
  }

  async deployPool(
    address: Address,
    config: PoolConfig,
    data: Hex = "0x"
  ): Promise<{ pool: Address }> {
    return this.#executeTransaction({
      abi: this.#poolFactory.abi,
      address: this.#poolFactory.address,
      functionName: "deploy",
      args: [address, config, data],
      eventName: "Created",
    });
  }

  async initializePool(
    pool: Address,
    config: PoolConfig,
    data: Hex = "0x"
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "initialize",
      args: [config, data],
    });
  }

  async register(
    pool: Address,
    project: Address,
    metadataURI: string,
    data: Hex = "0x"
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "register",
      args: [project, metadataURI, data],
      eventName: "Register",
    });
  }

  async review(
    pool: Address,
    project: Address,
    status: 0 | 1 | 2,
    metadataURI: string,
    data: Hex = "0x"
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "review",
      args: [project, status, metadataURI, data],
      eventName: "Review",
    });
  }

  async update(
    pool: Address,
    project: Address,
    metadataURI: string,
    data: Hex = "0x"
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "update",
      args: [project, metadataURI, data],
      eventName: "Update",
    });
  }

  async allocate(
    pool: Address,
    recipients: Address[],
    amounts: bigint[],
    token: Address,
    data: Hex[] = []
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "allocate",
      args: [recipients, amounts, token, data],
      eventName: "Allocate",
    });
  }

  async distribute(
    pool: Address,
    recipients: Address[],
    amounts: bigint[],
    token: Address,
    data: Hex[] = []
  ): Promise<void> {
    await this.#executeTransaction({
      abi: this.#pool.abi,
      address: pool,
      functionName: "distribute",
      args: [recipients, amounts, token, data],
      eventName: "Distribute",
    });
  }

  async #executeTransaction<T = any>({
    abi,
    address,
    functionName,
    args,
    value,
    eventName,
  }: {
    abi: Abi;
    address: Address;
    functionName: string;
    args?: any[];
    value?: bigint;
    eventName?: string;
  }): Promise<T> {
    const { request } = await simulateContract(this.#client, {
      abi,
      address,
      functionName,
      args,
      value,
    });

    const hash = await writeContract(this.#client, request);

    const receipt = await waitForTransactionReceipt(this.#publicClient(), {
      hash,
    });

    if (!eventName) return {} as T;

    const logs = parseEventLogs({
      abi,
      logs: receipt.logs,
    });

    const event = logs.find((log) => log.eventName === eventName);
    return event?.args as T;
  }

  #publicClient() {
    return createPublicClient({
      chain: this.#client.chain,
      transport: http(this.#rpcUrls[this.#client.chain.id] || ""),
    });
  }
}
