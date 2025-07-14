import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPoolContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  
  console.log(`Deploying to network: ${hre.network.name}`);
  console.log(`Deployer address: ${deployer}`);

  // Deploy PoolFactory
  console.log("\n📦 Deploying PoolFactory...");
  const poolFactory = await deploy("PoolFactory", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Network-specific EAS contract addresses
  const easAddresses: Record<string, string> = {
    // Arbitrum networks
    arbitrum: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
    arbitrumSepolia: "0x4200000000000000000000000000000000000021",
    
    // Celo networks
    celo: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
    celoAlfajores: "0x0000000000000000000000000000000000000000", // Update if you have testnet address
    
    // Fallback
    default: "0x0000000000000000000000000000000000000000"
  };

  const easAddress = easAddresses[hre.network.name] || easAddresses.default;
  
  console.log(`\n🔐 Using EAS address: ${easAddress} for network: ${hre.network.name}`);
  
  // Show EAS status
  if (easAddress === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  No EAS deployment available on this network");
  } else {
    console.log("✅ EAS integration enabled");
  }

  // Deploy SilviVerificationStrategy
  console.log("\n📦 Deploying SilviVerificationStrategy...");
  const silviStrategy = await deploy("SilviVerificationStrategy", {
    from: deployer,
    args: [
      "Silvi Verification Strategy",
      "address recipient, uint256 amount, bytes32 claimAttestationUID, bytes32 goalAttestationUID",
      "",
      easAddress
    ],
    log: true,
    autoMine: true,
  });

  console.log(`\n📋 Deployment Summary:`);
  console.log(`=====================`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`PoolFactory: ${poolFactory.address}`);
  console.log(`SilviVerificationStrategy: ${silviStrategy.address}`);
  console.log(`EAS Address: ${easAddress}`);
  console.log(`EAS Integration: ${easAddress !== "0x0000000000000000000000000000000000000000" ? "✅ Enabled" : "❌ Disabled"}`);
  
  // Additional network-specific info
  if (hre.network.name === "celo") {
    console.log(`\n🌟 Celo Mainnet Deployment Complete!`);
    console.log(`- Full EAS functionality available`);
    console.log(`- EAS Explorer: https://celo.easscan.org/`);
  } else if (hre.network.name === "arbitrum") {
    console.log(`\n🌟 Arbitrum Mainnet Deployment Complete!`);
    console.log(`- Full EAS functionality available`);
    console.log(`- EAS Explorer: https://arbitrum.easscan.org/`);
  }
};

export default deployPoolContracts;
deployPoolContracts.tags = ["PoolContracts"];