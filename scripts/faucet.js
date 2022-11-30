const hre = require('hardhat');


async function main(){
    // Get contract factory
    const contract = await hre.ethers.getContractAt('FaucetNFT', '0xf5Bb911eA5A67dB6370037B4Fb34689402a6B29B');
    const tx = await contract.faucetNFT();
    await tx.wait();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});