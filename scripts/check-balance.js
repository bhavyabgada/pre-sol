// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Get the network configuration
  const network = hre.network.name;
  console.log(`Checking balance on network: ${network}`);

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log(`Wallet address: ${deployer.address}`);

  // Get the balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log(`Balance: ${balanceInEth} ETH`);
  
  if (balance.toString() === "0") {
    console.log("\n⚠️ Your wallet has 0 ETH. You need ETH to deploy contracts.");
    console.log("To get Base Goerli testnet ETH:");
    console.log("1. Get Goerli ETH from a faucet like https://goerlifaucet.com/");
    console.log("2. Bridge your Goerli ETH to Base Goerli using https://bridge.base.org/");
    console.log("3. Or use the Base Goerli Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
  } else {
    console.log("\n✅ Your wallet has enough ETH to deploy contracts.");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 