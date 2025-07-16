import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployPoolContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [deployer] = await ethers.getSigners();
  const { deploy } = hre.deployments;

  console.log(`Deploying to network: ${hre.network.name}`);
  console.log(`Deployer address: ${deployer.address}`);

  // Deploy PoolFactory
  console.log("\nDeploying PoolFactory...");
  const poolFactory = await deploy("PoolFactory", {
    from: deployer.address,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy SilviVerificationStrategy
  console.log("\nDeploying SilviVerificationStrategy...");
  const silviStrategy = await deploy("SilviVerificationStrategy", {
    from: deployer.address,
    args: [
      "Silvi Verification Strategy",
      "address recipient, uint256 amount, bytes32 claimAttestationUID, bytes32 goalAttestationUID",
      ""
    ],
    log: true,
    autoMine: true,
  });

  console.log(`\nDeployment Summary:`);
  console.log(`=====================`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`PoolFactory: ${poolFactory.address}`);
  console.log(`SilviVerificationStrategy: ${silviStrategy.address}`);
};

export default deployPoolContracts;
deployPoolContracts.tags = ["PoolContracts"];