import { createConfig } from "ponder";
import { http } from "viem";
import deployedContracts from "./contracts/deployedContracts";
import { baseSepolia, hardhat } from "viem/chains";

const isDev = process.env.NODE_ENV === "development";

const targetNetwork = isDev ? hardhat : baseSepolia;
const START_BLOCK = isDev ? 0 : 26638593;

const networks = {
  [targetNetwork.name]: {
    id: targetNetwork.id,
    rpc: http(process.env[`PONDER_RPC_URL_${targetNetwork.id}`]),
  },
};

console.log(process.env[`PONDER_RPC_URL_${targetNetwork.id}`]);
const { Pool, PoolFactory } = deployedContracts[targetNetwork.id];

/*
TODO: Handle multiple networks

It should build a contracts object with:
- the PoolFactory and Pool contracts
- filter event "Created" for PoolFactory
- chain object with configured chains and addresses

const chains = Object.fromEntries(
  Object.entries({
    ...(isDev ? { hardhat } : {}),
    baseSepolia,
  }).map(([name, { id }]) => [
    name,
    { id, rpc: http(process.env[`PONDER_RPC_URL_${id}`]) },
  ])
);
 */

console.log(targetNetwork);

export default createConfig({
  chains: networks,
  contracts: {
    PoolFactory: {
      chain: targetNetwork.name,
      abi: PoolFactory.abi,
      address: PoolFactory.address,
      filter: { event: "Created" },
      startBlock: PoolFactory.startBlock || 0,
    },
    Pool: {
      chain: targetNetwork.name,
      abi: Pool.abi,
      startBlock: Pool.startBlock || START_BLOCK,
    },
  },
});
