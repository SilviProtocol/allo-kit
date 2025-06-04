import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("PoolFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    autoMine: true,
  });

  const owner = deployer; // Add your owner address here

  await deploy("Pool", {
    from: deployer,
    // Contract constructor arguments
    args: [
      "",
      "",
      {
        owner,
        allocationToken: "0x0000000000000000000000000000000000000000",
        distributionToken: "0x0000000000000000000000000000000000000000",
        maxAmount: 0n,
        metadataURI: "",
        admins: [],
        timestamps: [],
      },
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("RetroFunding", {
    from: deployer,
    // Contract constructor arguments
    args: [
      "RetroFunding",
      "uint256 amount",
      {
        owner,
        allocationToken: "0x0000000000000000000000000000000000000000",
        distributionToken: "0x0000000000000000000000000000000000000000",
        maxAmount: 0n,
        metadataURI: "",
        admins: [],
        timestamps: [],
      },
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // await deploy("QuadraticFunding", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [
  //     "QuadraticFunding",
  //     "uint256 amount",
  //     {
  //       owner,
  //       allocationToken: "0x0000000000000000000000000000000000000000",
  //       distributionToken: "0x0000000000000000000000000000000000000000",
  //       maxAmount: 0n,
  //       metadataURI: "",
  //       admins: [],
  //       timestamps: [],
  //     },
  //   ],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  // });
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["SimpleGrants"];
