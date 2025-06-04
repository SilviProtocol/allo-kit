import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import { type Abi } from "viem";
import deployedContracts from "./contracts/deployedContracts";

const contracts = Object.entries<{ abi: Abi }>(deployedContracts["31337"]).map(
  ([name, { abi }]) => {
    return { name, abi };
  }
);

console.log(contracts);
export default defineConfig({
  out: "generated/wagmi.ts",
  contracts,
  plugins: [actions()],
});
