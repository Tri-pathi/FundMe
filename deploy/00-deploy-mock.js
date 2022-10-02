const {network}=require("hardhat");
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
//const{devlopmentChains, INITIAL_ANSWER, DECIMALS}=require("../hardhat-helper-config");
module.exports=async (hre)=>{
    const{getNamedAccounts,deployments}=hre;
  
    const{deploy,log}=deployments;
    const{deployer}= await getNamedAccounts();
  
    const chainId=network.config.chainId;
    if(chainId==31337){
        log("local network found Deploying Mask.....");
        await deploy("MockV3Aggregator",{
            contract: "MockV3Aggregator",
            from :deployer,
            log:true,
            args :[DECIMALS,INITIAL_PRICE],

        })
        log("Mocks Deployed..");
        log("**********____________**********");
    }

}
module.exports.tags=["all","mocks"];
