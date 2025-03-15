require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Get private key from .env file or use a default one for testing (this is a valid format but should NEVER be used in production)
const PRIVATE_KEY = process.env.PRIVATE_KEY || "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // Configuration for Base Goerli testnet
    base_goerli: {
      url: "https://base-goerli.public.blastapi.io",
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: 1000000000,
      timeout: 60000 // 60 seconds
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 