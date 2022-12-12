const hre = require('hardhat');


async function main(){
    // Get contract factory
    const contract = await hre.ethers.getContractAt('FaucetNFT', '0x949aa4BCb55c322dCD6088A61df1C0754061Db40');
    const tx = await contract.faucetNFT();
    await tx.wait();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});