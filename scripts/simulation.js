const { ethers } = require('hardhat');
const hre = require('hardhat');


async function main(){
    let deployer, seller, buyer, tokenId

    // Setup account
    [deployer, seller, buyer] = await hre.ethers.getSigners();

    // Access contract
    const escrow = await hre.ethers.getContractAt('escrowNFT', '0xeEF4c9B3681C57ae93B908355ea987F8Cc8c5D59');
    const faucet = await hre.ethers.getContractAt('FaucetNFT', '0x31deCdA47EE0DDFEa3451aaD6c76B29Daa6A0387');

    // Preparation
    let paymentAmount = await hre.ethers.utils.parseEther('0.5');
    const txToSeller = await deployer.sendTransaction({
        to:seller.address,
        value: hre.ethers.utils.parseEther('1.5')
    });
    await txToSeller.wait();

    const txToBuyer = await deployer.sendTransaction({
        to: buyer.address,
        value: hre.ethers.utils.parseEther('1.5')
    });

    const txFaucet = await faucet.connect(seller).faucetNFT();
    await txFaucet.wait();



    // Simulation
    tokenId = 0
    const txApprove = await faucet.connect(seller).approve(escrow.address, tokenId);
    await txApprove.wait();

    const secret = await hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(Math.random().toString()));
    const txId = await escrow.connect(seller).getTxId(seller.address, buyer.address, faucet.address, secret);
    
    console.log("Create escrow");
    const txCreateEscrow = await escrow.connect(seller).createEscrow(
        txId,
        tokenId,
        paymentAmount,
        faucet.address,
        buyer.address
    );
    await txCreateEscrow.wait();

    console.log("Buyer pay escrow");
    const txPayEscrow = await escrow.connect(buyer).payEscrow(txId, {value:paymentAmount});
    await txPayEscrow.wait();

    const nftBalance = await faucet.balanceOf(buyer.address)

    console.log("Transaction Data");
    console.log("Tx ID: ", txId.toNumber());
    console.log("Seller Address: ", seller.address);
    console.log("Buyer  Address: ", buyer.address);
    console.log("Buyer NFT Balance: ", nftBalance.toNumber());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
})