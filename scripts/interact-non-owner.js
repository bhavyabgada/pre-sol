// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Get the network
  const network = hre.network.name;
  console.log(`Interacting with RewardToken on network: ${network}`);

  // Get the signers - we'll use the second account as a non-owner
  const [owner, nonOwner] = await ethers.getSigners();
  console.log(`Owner account: ${owner.address}`);
  console.log(`Non-owner account: ${nonOwner.address}`);

  // Get the contract factory
  const RewardToken = await ethers.getContractFactory("RewardToken");
  
  // Deploy a new contract for testing
  console.log("Deploying a new RewardToken contract for testing...");
  const rewardToken = await RewardToken.deploy(owner.address);
  await rewardToken.waitForDeployment();
  const contractAddress = await rewardToken.getAddress();
  console.log(`Deployed new contract to: ${contractAddress}`);

  // Display token info
  console.log(`\nToken Info:`);
  console.log(`Token Name: ${await rewardToken.name()}`);
  console.log(`Token Symbol: ${await rewardToken.symbol()}`);
  console.log(`Total Supply: ${ethers.formatEther(await rewardToken.totalSupply())} SRT`);
  console.log(`Owner: ${await rewardToken.owner()}`);
  
  // Mint some tokens as the owner
  const mintAmount = ethers.parseEther("100");
  console.log(`\nOwner minting ${ethers.formatEther(mintAmount)} tokens to non-owner...`);
  const mintTx = await rewardToken.mint(nonOwner.address, mintAmount);
  await mintTx.wait();
  console.log(`Minted ${ethers.formatEther(mintAmount)} tokens to non-owner`);
  
  // Check non-owner balance
  const nonOwnerBalance = await rewardToken.balanceOf(nonOwner.address);
  console.log(`Non-owner balance: ${ethers.formatEther(nonOwnerBalance)} SRT`);
  
  // Try to mint tokens as non-owner (should fail)
  console.log(`\nNon-owner attempting to mint tokens (should fail)...`);
  try {
    await rewardToken.connect(nonOwner).mint(nonOwner.address, mintAmount);
    console.log("❌ Mint succeeded when it should have failed!");
  } catch (error) {
    console.log("✅ Mint failed as expected: Non-owner cannot mint tokens");
  }
  
  // Try to reward a user as non-owner (should fail)
  console.log(`\nNon-owner attempting to reward a user (should fail)...`);
  try {
    await rewardToken.connect(nonOwner).rewardUser(nonOwner.address, mintAmount, "Planted trees");
    console.log("❌ Reward succeeded when it should have failed!");
  } catch (error) {
    console.log("✅ Reward failed as expected: Non-owner cannot reward users");
  }
  
  // Transfer tokens as non-owner (should succeed)
  const transferAmount = ethers.parseEther("25");
  console.log(`\nNon-owner transferring ${ethers.formatEther(transferAmount)} tokens to owner...`);
  const transferTx = await rewardToken.connect(nonOwner).transfer(owner.address, transferAmount);
  await transferTx.wait();
  console.log("✅ Transfer succeeded as expected: Any token holder can transfer tokens");
  
  // Check balances after transfer
  const newNonOwnerBalance = await rewardToken.balanceOf(nonOwner.address);
  const ownerBalance = await rewardToken.balanceOf(owner.address);
  console.log(`Non-owner balance: ${ethers.formatEther(newNonOwnerBalance)} SRT`);
  console.log(`Owner balance: ${ethers.formatEther(ownerBalance)} SRT`);
  
  // Burn tokens as non-owner (should succeed)
  const burnAmount = ethers.parseEther("25");
  console.log(`\nNon-owner burning ${ethers.formatEther(burnAmount)} tokens...`);
  const burnTx = await rewardToken.connect(nonOwner).burn(burnAmount);
  await burnTx.wait();
  console.log("✅ Burn succeeded as expected: Any token holder can burn their tokens");
  
  // Check balance after burn
  const finalNonOwnerBalance = await rewardToken.balanceOf(nonOwner.address);
  console.log(`Non-owner final balance: ${ethers.formatEther(finalNonOwnerBalance)} SRT`);
  console.log(`Total supply: ${ethers.formatEther(await rewardToken.totalSupply())} SRT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 