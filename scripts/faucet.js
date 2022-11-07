const hre = require('hardhat');


async function main(){
    // Get contract factory
    const contract = await hre.ethers.getContractAt('FaucetNFT', '0x0FA2488bBA28A94e166972100C460C94c4123DB3');
    const tx = await contract.approve("0x1dbA2902A43d2e0af4DF890Ae22FFf9CE5B79108", 1);
    await tx.wait();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});