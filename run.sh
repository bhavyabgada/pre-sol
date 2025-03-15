#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   Sustainability Reward Token - Setup    ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Function to check if a command was successful
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        echo -e "${YELLOW}Please check the error message above.${NC}"
        exit 1
    fi
}

# Step 1: Install dependencies
echo -e "\n${YELLOW}Step 1: Installing dependencies...${NC}"
npm install
check_status

# Step 2: Compile contracts
echo -e "\n${YELLOW}Step 2: Compiling contracts...${NC}"
npx hardhat compile
check_status

# Step 3: Run tests
echo -e "\n${YELLOW}Step 3: Running tests...${NC}"
npx hardhat test
check_status

# Step 4: Deploy to local hardhat network
echo -e "\n${YELLOW}Step 4: Deploying to local hardhat network...${NC}"
npx hardhat run scripts/deploy.js --network hardhat
check_status

# Step 5: Interact with the contract
echo -e "\n${YELLOW}Step 5: Interacting with the contract...${NC}"
npx hardhat run scripts/interact.js --network hardhat
check_status

# Print summary
echo -e "\n${BLUE}==================================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${BLUE}==================================================${NC}"

echo -e "\n${YELLOW}For testnet deployment:${NC}"
echo -e "1. Update your private key in .env file"
echo -e "2. Run: ${GREEN}npx hardhat run scripts/deploy.js --network base_goerli${NC}"
echo -e "3. Update CONTRACT_ADDRESS in .env with the deployed address"
echo -e "4. Run: ${GREEN}npx hardhat run scripts/interact.js --network base_goerli${NC}" 