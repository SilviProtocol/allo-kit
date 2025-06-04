import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import deployedContracts from "../nextjs/contracts/deployedContracts";
import { Abi } from "viem";

const contracts = Object.entries<{ abi: Abi }>(deployedContracts["31337"])
  .map(([name, { abi }]) => {
    return { name, abi };
  })
  .filter((contract) => ["Pool", "PoolFactory"].includes(contract.name));

console.log(contracts);

export default defineConfig({
  out: "generated/wagmi.ts",
  contracts,
  plugins: [react()],
});
