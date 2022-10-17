// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers} = require("hardhat") ;

async function main() {
   /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */

  const whitelistContract = await ethers.getContractFactory("WhiteList"); 

  // here we delpoy the contract
  const deployWhitelistContract = await whitelistContract.deploy(10) ;
  // 10 the the meximun number ob address, so y

  // wait for it to finish deploying
  await deployWhitelistContract.deployed() ; 

  console.log("White list contract adress: " , deployWhitelistContract.address )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
