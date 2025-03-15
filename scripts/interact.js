// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Get the network
  const network = hre.network.name;
  console.log(`Interacting with RewardToken on network: ${network}`);

  // Get the signer
  const [owner] = await ethers.getSigners();
  console.log(`Using account: ${owner.address}`);

  // Get the contract factory
  const RewardToken = await ethers.getContractFactory("RewardToken");
  
  let rewardToken;
  let contractAddress = process.env.CONTRACT_ADDRESS;

  // If we're on the hardhat network, deploy a new contract for testing
  if (network === "hardhat") {
    console.log("Deploying a new RewardToken contract for testing...");
    rewardToken = await RewardToken.deploy(owner.address);
    await rewardToken.waitForDeployment();
    contractAddress = await rewardToken.getAddress();
    console.log(`Deployed new contract to: ${contractAddress}`);
  } else {
    // For other networks, use the address from .env
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      process.exit(1);
    }
    console.log(`Using existing contract at: ${contractAddress}`);
    rewardToken = RewardToken.attach(contractAddress);
  }

  // Display token info
  console.log(`\nToken Info:`);
  console.log(`Token Name: ${await rewardToken.name()}`);
  console.log(`Token Symbol: ${await rewardToken.symbol()}`);
  console.log(`Total Supply: ${ethers.formatEther(await rewardToken.totalSupply())} SRT`);
  console.log(`Owner: ${await rewardToken.owner()}`);
  
  // Check if the signer is the owner
  const isOwner = (await rewardToken.owner()).toLowerCase() === owner.address.toLowerCase();
  console.log(`Is signer the owner? ${isOwner}`);

  // Menu of actions
  console.log("\nAvailable Actions:");
  console.log("1. Mint tokens (owner only)");
  console.log("2. Reward a user (owner only)");
  console.log("3. Check balance of an address");
  console.log("4. Transfer tokens to an address");
  console.log("5. Burn tokens");

  // Example: Mint some tokens if we're the owner (for testing)
  if (isOwner && network === "hardhat") {
    const testUser = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Second account in hardhat
    const amount = ethers.parseEther("100");
    console.log(`\nMinting ${ethers.formatEther(amount)} tokens to ${testUser}...`);
    const tx = await rewardToken.mint(testUser, amount);
    await tx.wait();
    console.log(`Minted ${ethers.formatEther(amount)} tokens to ${testUser}`);
    console.log(`New total supply: ${ethers.formatEther(await rewardToken.totalSupply())} SRT`);
    
    // Check the balance
    const balance = await rewardToken.balanceOf(testUser);
    console.log(`Balance of ${testUser}: ${ethers.formatEther(balance)} SRT`);
    
    // Reward the user for a sustainability action
    const rewardAmount = ethers.parseEther("50");
    const action = "Planted 10 trees";
    console.log(`\nRewarding ${ethers.formatEther(rewardAmount)} tokens to ${testUser} for "${action}"...`);
    const rewardTx = await rewardToken.rewardUser(testUser, rewardAmount, action);
    await rewardTx.wait();
    console.log(`Rewarded ${ethers.formatEther(rewardAmount)} tokens to ${testUser}`);
    
    // Check the updated balance
    const newBalance = await rewardToken.balanceOf(testUser);
    console.log(`Updated balance of ${testUser}: ${ethers.formatEther(newBalance)} SRT`);
  }

  // To perform other actions, uncomment and modify the code below:
  
  /*
  // 3. Check balance of an address
  const addressToCheck = "ADDRESS_TO_CHECK";
  const balance = await rewardToken.balanceOf(addressToCheck);
  console.log(`\nBalance of ${addressToCheck}: ${ethers.formatEther(balance)} SRT`);

  // 4. Transfer tokens to an address
  const recipient = "RECIPIENT_ADDRESS";
  const amount = ethers.parseEther("5");
  console.log(`\nTransferring ${ethers.formatEther(amount)} tokens to ${recipient}...`);
  const tx = await rewardToken.transfer(recipient, amount);
  await tx.wait();
  console.log(`Transferred ${ethers.formatEther(amount)} tokens to ${recipient}`);

  // 5. Burn tokens
  const burnAmount = ethers.parseEther("2");
  console.log(`\nBurning ${ethers.formatEther(burnAmount)} tokens...`);
  const tx = await rewardToken.burn(burnAmount);
  await tx.wait();
  console.log(`Burned ${ethers.formatEther(burnAmount)} tokens`);
  console.log(`New balance: ${ethers.formatEther(await rewardToken.balanceOf(owner.address))} SRT`);
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 