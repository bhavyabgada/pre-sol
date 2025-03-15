// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");

async function main() {
  console.log("Deploying RewardToken contract...");

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the RewardToken contract
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);

  await rewardToken.waitForDeployment();
  
  const address = await rewardToken.getAddress();
  console.log("RewardToken deployed to:", address);

  console.log("Token Name:", await rewardToken.name());
  console.log("Token Symbol:", await rewardToken.symbol());
  console.log("Owner:", await rewardToken.owner());

  // For verification purposes
  console.log("Contract deployment completed. Verify with:");
  console.log(`npx hardhat verify --network base_goerli ${address} ${deployer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 