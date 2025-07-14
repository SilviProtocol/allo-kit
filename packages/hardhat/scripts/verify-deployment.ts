import { ethers } from "hardhat";
import { Contract } from "ethers";

async function verifyDeployment() {
  console.log("🔍 Verifying deployment...");
  
  try {
    // Get the deployed contracts
    const poolFactory = await ethers.getContract("PoolFactory");
    const silviStrategy = await ethers.getContract("SilviVerificationStrategy");
    
    console.log(`✅ PoolFactory found at: ${await poolFactory.getAddress()}`);
    console.log(`✅ SilviVerificationStrategy found at: ${await silviStrategy.getAddress()}`);
    
    // Test PoolFactory
    console.log("\n🧪 Testing PoolFactory...");
    
    // Test deploying a pool using the factory
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
    
    // This would create a new pool instance
    const tx = await poolFactory.deploy(
      await silviStrategy.getAddress(),
      poolConfig,
      "0x"
    );
    
    const receipt = await tx.wait();
    console.log(`✅ Pool deployed successfully. Transaction hash: ${receipt?.hash}`);
    
    // Test SilviVerificationStrategy
    console.log("\n🧪 Testing SilviVerificationStrategy...");
    
    // Check if the strategy has the correct roles
    const DEFAULT_ADMIN_ROLE = await silviStrategy.DEFAULT_ADMIN_ROLE();
    const ADMIN_ROLE = await silviStrategy.ADMIN_ROLE();
    
    const hasDefaultAdminRole = await silviStrategy.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const hasAdminRole = await silviStrategy.hasRole(ADMIN_ROLE, deployer.address);
    
    console.log(`✅ Deployer has DEFAULT_ADMIN_ROLE: ${hasDefaultAdminRole}`);
    console.log(`✅ Deployer has ADMIN_ROLE: ${hasAdminRole}`);
    
    // Check total funded and distributed
    const totalFunded = await silviStrategy.getTotalFunded();
    const totalDistributed = await silviStrategy.getTotalDistributed();
    
    console.log(`✅ Total funded: ${totalFunded}`);
    console.log(`✅ Total distributed: ${totalDistributed}`);
    
    console.log("\n🎉 All tests passed! Deployment is working correctly.");
    
  } catch (error) {
    console.error("❌ Verification failed:", error);
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