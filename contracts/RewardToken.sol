// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts for ERC-20 and Ownable functionality
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC-20 token for rewarding users who perform verified sustainability actions
 * Minting is restricted to the contract owner
 */
contract RewardToken is ERC20, Ownable {
    // Events
    event UserRewarded(address indexed user, uint256 amount, string actionDescription);
    
    /**
     * @dev Constructor initializes the token with a name and symbol
     * @param initialOwner The address that will be granted the owner role
     */
    constructor(address initialOwner) 
        ERC20("Sustainability Reward Token", "SRT") 
        Ownable(initialOwner) 
    {
        // No initial supply is minted at deployment
    }
    
    /**
     * @dev Mint new tokens - restricted to the contract owner
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Reward tokens to users who perform verified sustainability actions
     * @param user The address of the user to reward
     * @param amount The amount of tokens to reward
     * @param actionDescription A description of the sustainability action performed
     */
    function rewardUser(address user, uint256 amount, string memory actionDescription) public onlyOwner {
        require(user != address(0), "Cannot reward to the zero address");
        require(amount > 0, "Reward amount must be greater than zero");
        
        // Mint new tokens directly to the user
        _mint(user, amount);
        
        // Emit an event for tracking purposes
        emit UserRewarded(user, amount, actionDescription);
    }
    
    /**
     * @dev Burns tokens from the caller's account
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
} 