const hre = require("hardhat");

async function main() {

    let dev, fee;

    // Setup deployer account
    [dev] = await hre.ethers.getSigners();

    // Get Contract factory
    const escrowNFT = await hre.ethers.getContractFactory('escrowNFT');
    const faucetNFT = await hre.ethers.getContractFactory('FaucetNFT');

    // Deploy contract
    fee = await hre.ethers.utils.parseEther('0.5');
    const escrow = await escrowNFT.deploy(fee);
    await escrow.deployed();

    const faucet = await faucetNFT.deploy();
    await faucet.deployed();

    console.log("Contract Address");
    console.log("Escrow: ", escrow.address);
    console.log("Faucet: ", faucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
