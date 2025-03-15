const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardToken", function () {
  let RewardToken;
  let rewardToken;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the RewardToken contract
    RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy(owner.address);
    await rewardToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rewardToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await rewardToken.name()).to.equal("Sustainability Reward Token");
      expect(await rewardToken.symbol()).to.equal("SRT");
    });

    it("Should have zero initial supply", async function () {
      expect(await rewardToken.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      await rewardToken.mint(user1.address, mintAmount);
      
      expect(await rewardToken.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await rewardToken.totalSupply()).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      
      await expect(
        rewardToken.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWithCustomError(rewardToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Rewarding Users", function () {
    it("Should reward users for sustainability actions", async function () {
      const rewardAmount = ethers.parseEther("10");
      const actionDescription = "Planted 5 trees";
      
      await expect(rewardToken.rewardUser(user1.address, rewardAmount, actionDescription))
        .to.emit(rewardToken, "UserRewarded")
        .withArgs(user1.address, rewardAmount, actionDescription);
      
      expect(await rewardToken.balanceOf(user1.address)).to.equal(rewardAmount);
    });

    it("Should not allow non-owner to reward users", async function () {
      const rewardAmount = ethers.parseEther("10");
      
      await expect(
        rewardToken.connect(user1).rewardUser(user2.address, rewardAmount, "Recycled waste")
      ).to.be.revertedWithCustomError(rewardToken, "OwnableUnauthorizedAccount");
    });

    it("Should not allow rewarding zero address", async function () {
      const rewardAmount = ethers.parseEther("10");
      
      await expect(
        rewardToken.rewardUser(ethers.ZeroAddress, rewardAmount, "Invalid action")
      ).to.be.revertedWith("Cannot reward to the zero address");
    });

    it("Should not allow zero reward amount", async function () {
      await expect(
        rewardToken.rewardUser(user1.address, 0, "Invalid amount")
      ).to.be.revertedWith("Reward amount must be greater than zero");
    });
  });

  describe("Token Operations", function () {
    beforeEach(async function () {
      // Mint some tokens to user1 for testing
      await rewardToken.mint(user1.address, ethers.parseEther("100"));
    });

    it("Should allow users to transfer tokens", async function () {
      const transferAmount = ethers.parseEther("25");
      
      await rewardToken.connect(user1).transfer(user2.address, transferAmount);
      
      expect(await rewardToken.balanceOf(user1.address)).to.equal(ethers.parseEther("75"));
      expect(await rewardToken.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("50");
      const initialSupply = await rewardToken.totalSupply();
      
      await rewardToken.connect(user1).burn(burnAmount);
      
      expect(await rewardToken.balanceOf(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await rewardToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });
}); 