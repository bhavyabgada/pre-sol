# Sustainability Reward Token

A Solidity smart contract implementing an ERC-20 token for rewarding users who perform verified sustainability actions on the Base blockchain.

## Overview

The RewardToken contract:
- Tracks user sustainability actions
- Incentivizes sustainable behavior through token rewards
- Implements standard ERC-20 functionality
- Restricts token minting to the contract owner

## Features

- ERC-20 Compliance
- Owner Controls via OpenZeppelin's Ownable
- Reward System for sustainability actions
- Event Tracking for transparency

## Setup

### Prerequisites
- Node.js and npm
- Hardhat

### Installation
```bash
npm install
```

### Compile
```bash
npx hardhat compile
```

### Test
```bash
npx hardhat test
```

## Local Deployment

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy.js --network hardhat

# Interact with the contract
npx hardhat run scripts/interact.js --network hardhat
```

## Testnet Deployment

1. Set up `.env` file:
```
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address
```

2. Get testnet ETH from a faucet

3. Deploy and interact:
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network base_goerli

# Deploy
npx hardhat run scripts/deploy.js --network base_goerli

# Update CONTRACT_ADDRESS in .env

# Interact
npx hardhat run scripts/interact.js --network base_goerli
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 