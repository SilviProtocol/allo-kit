import { ethers } from "hardhat";

async function verifyDeployment() {
  console.log("Verifying deployment...");

  try {
    // Network-specific EAS contract addresses
    const easAddresses: Record<string, string> = {
      // Arbitrum networks
      arbitrum: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
      arbitrumSepolia: "0x4200000000000000000000000000000000000021",

      // Celo networks
      celo: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
      celoAlfajores: "0x0000000000000000000000000000000000000000", // Update if testnet address becomes available

      // Fallback
      default: "0x0000000000000000000000000000000000000000"
    };

    const network = await ethers.provider.getNetwork();
    const networkName = network.name || "default";
    const easAddress = easAddresses[networkName] || easAddresses.default;

    console.log(`\nUsing EAS address: ${easAddress} for network: ${networkName}`);

    // Show EAS status
    if (easAddress === "0x0000000000000000000000000000000000000000") {
      console.log("No EAS deployment available on this network");
    } else {
      console.log("EAS integration enabled");
    }

    // Get the deployed contracts
    const poolFactory = await ethers.getContract("PoolFactory");
    const silviStrategy = await ethers.getContract("SilviVerificationStrategy");

    if (!poolFactory || !silviStrategy) {
      throw new Error("Failed to retrieve deployed contracts");
    }

    console.log(`PoolFactory found at: ${await poolFactory.getAddress()}`);
    console.log(`SilviVerificationStrategy found at: ${await silviStrategy.getAddress()}`);

    // Encode PoolConfig
    const [deployer] = await ethers.getSigners();
    const poolConfig = {
      owner: deployer.address,
      allocationToken: ethers.ZeroAddress,
      distributionToken: ethers.ZeroAddress,
      maxAmount: 0,
      metadataURI: "",
      admins: [],
      timestamps: []
    };

    // Encode EAS address to pass in data parameter
    const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(["address"], [easAddress]);

    // Test PoolFactory
    console.log("\nTesting PoolFactory...");

    // Test deploying a pool using the factory
    let receipt;
    let deployedPoolAddress: string;

    try {
      const tx = await poolFactory.deploy(
        await silviStrategy.getAddress(),
        poolConfig,
        encodedData
      );
      receipt = await tx.wait();

      // Get the deployed pool address from the Created event
      const createdEvent = receipt?.logs.find(log => {
        try {
          const parsedLog = poolFactory.interface.parseLog(log);
          return parsedLog?.name === "Created";
        } catch {
          return false;
        }
      });

      if (createdEvent) {
        const parsedLog = poolFactory.interface.parseLog(createdEvent);
        deployedPoolAddress = parsedLog?.args.pool;
        console.log(`Pool deployed successfully at: ${deployedPoolAddress}`);
        console.log(`Transaction hash: ${receipt?.hash}`);
      } else {
        throw new Error("Created event not found in transaction receipt");
      }
    } catch (error: any) {
      throw new Error(`Failed to deploy pool using factory: ${error.message}`);
    }

    // Test the deployed pool contract
    console.log("\nTesting deployed pool contract...");

    // Get the deployed pool contract instance
    const deployedPool = await ethers.getContractAt("SilviVerificationStrategy", deployedPoolAddress);

    // Check if the deployed pool has the correct roles
    const DEFAULT_ADMIN_ROLE = await deployedPool.DEFAULT_ADMIN_ROLE();
    const ADMIN_ROLE = await deployedPool.ADMIN_ROLE();

    const hasDefaultAdminRole = await deployedPool.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const hasAdminRole = await deployedPool.hasRole(ADMIN_ROLE, deployer.address);

    console.log(`Deployer has DEFAULT_ADMIN_ROLE: ${hasDefaultAdminRole}`);
    console.log(`Deployer has ADMIN_ROLE: ${hasAdminRole}`);

    // Validate roles and fail if not correct
    if (!hasDefaultAdminRole) {
      throw new Error("Deployer does not have DEFAULT_ADMIN_ROLE");
    }

    if (!hasAdminRole) {
      throw new Error("Deployer does not have ADMIN_ROLE");
    }

    // Check total funded and distributed
    const totalFunded = await silviStrategy.getTotalFunded();
    const totalDistributed = await silviStrategy.getTotalDistributed();

    console.log(`Total funded: ${totalFunded}`);
    console.log(`Total distributed: ${totalDistributed}`);

    // Optional validation: Verify that initial values are as expected
    if (totalFunded !== 0n && totalFunded !== BigInt(0)) {
      throw new Error(`Unexpected initial totalFunded value: ${totalFunded.toString()}`);
    }

    if (totalDistributed !== 0n && totalDistributed !== BigInt(0)) {
      throw new Error(`Unexpected initial totalDistributed value: ${totalDistributed.toString()}`);
    }

    console.log("\nAll tests passed! Deployment is working correctly.");
    console.log(`EAS Address: ${easAddress}`);
    console.log(`EAS Integration: ${easAddress !== "0x0000000000000000000000000000000000000000" ? "Enabled" : "Disabled"}`);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

// Run the verification
verifyDeployment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });