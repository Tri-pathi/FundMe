const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
  let fundMe;
  let deployer;
  let MockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async function () {
    it("sets the aggregator address correctly", async function () {
      const response = await fundMe.priceFeed();
      assert.equal(response, MockV3Aggregator.address);
    });
  });
  describe("fund", async function () {
    it("Fails if not enough eth is sent", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("it's update the balance in addressToAmountFunded mapping", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert(sendValue.toString(), response.toString());
    });
    it("it's update the funders to funder array", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders[0];
      assert(deployer, response);
    });
  });
  describe("withDraw", async function () {
    beforeEach(async () => {
        await fundMe.fund({ value: sendValue })
    })
    it("withdraws ETH from a single funder", async () => {
    const startingFundMeBalance = await fundMe.provider.getBalance(
      fundMe.address
    );
    const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

    // Act
    const transactionResponse = await fundMe.withdraw();
    const transactionReceipt = await transactionResponse.wait();
    const { gasUsed, effectiveGasPrice } = transactionReceipt;
    const gasCost = gasUsed.mul(effectiveGasPrice);

    const endingFundMeBalance = await fundMe.provider.getBalance(
      fundMe.address
    );
    const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

    // Assert
    // Maybe clean up to understand the testing
    assert.equal(endingFundMeBalance, 0);
    assert.equal(
      startingFundMeBalance.add(startingDeployerBalance).toString(),
      endingDeployerBalance.add(gasCost).toString()
    );
  });
});
});
