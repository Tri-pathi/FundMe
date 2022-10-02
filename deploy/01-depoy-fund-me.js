
const {networkConfig, devlopmentChains}=require("../hardhat-helper-config");
const {network}=require("hardhat");
const{verify}=require("../utils/verify");
module.exports=async (hre)=>{
  const{getNamedAccounts,deployments}=hre;

  const{deploy,log}=deployments;
  const{deployer}= await getNamedAccounts();

  const chainId=network.config.chainId;

  let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    const args=[ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
})
  log(`FundMe deployed at ${fundMe.address}`);
  if(chainId!=31337 && process.env.ETHERSCAN_API_KEY){
     await verify(fundMe.address, args);
  }
  log("**********____________**********");
};

module.exports.tags=["all","fundme"];


// from goerli testnet 
// deploying "FundMe" (tx: 0x53c567f70e83ee1bae77460c1ba7c816a0a7008381ed323559c923d2ca71cd26)...: deployed at 0xF896Ed796c2E39799cf412921500e60fb52E6d4B with 901252 gas
// FundMe deployed at 0xF896Ed796c2E39799cf412921500e60fb52E6d4B
// FundMe deployed at 0xF896Ed796c2E39799cf412921500e60fb52E6d4B
// **********____________**********