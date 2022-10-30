const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("escrow NFT: Owner Scope Test", function () {
    let owner, nonOwner, fee;

    before(async function () {
        this.contract = await ethers.getContractFactory("escrowNFT");
    });

    this.beforeEach(async function () {
        fee = await ethers.utils.parseEther("0.5");
        [owner, nonOwner] = await ethers.getSigners();
        this.escrow = await this.contract.deploy(fee);
        await this.escrow.deployed();
    });

    it("Owner update fee", async function () {
        const newFee = await ethers.utils.parseEther("1");
        const tx = await this.escrow.updateFee(newFee);

        expect(await this.escrow.fee()).to.be.equal(newFee);
    });

    it("Non owner update fee", async function () {
        const newFee = await ethers.utils.parseEther("1");
        await expect(
            this.escrow.connect(nonOwner).updateFee(newFee)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
});

describe("escrow NFT: Seller & Buyer Scope Test", async function () {
    let seller, buyer, paymentAmount, fee, random, secret;

    before(async function () {
        this.contract = await ethers.getContractFactory("escrowNFT");
        this.nftContract = await ethers.getContractFactory("FaucetNFT");
    });

    this.beforeEach(async function () {
        random = Math.random();
        secret = await ethers.utils.keccak256(ethers.utils.toUtf8Bytes(random.toString()));
        fee = await ethers.utils.parseEther("0.5");
        paymentAmount = await ethers.utils.parseEther("1");
        [seller, buyer] = await ethers.getSigners();

        this.escrow = await this.contract.deploy(fee)
        await this.escrow.deployed();

        this.nft = await this.nftContract.deploy();
        await this.nft.deployed();

        // Request faucet & approve escrow contract
        const txFaucet = await this.nft.faucetNFT();
        await txFaucet.wait();

        const txApprove = await this.nft.approve(this.escrow.address, 0);
    });

    it("Create new escrow", async function (){
        const txId = await this.escrow.getTxId(seller.address, buyer.address, this.nft.address, secret);
        const tx = await this.escrow.createEscrow(
            txId,
            0,
            paymentAmount,
            this.nft.address,
            buyer.address
        );
        await tx.wait();
        expect(await this.nft.ownerOf(0)).to.be.equal(this.escrow.address);
        expect(await this.nft.balanceOf(this.escrow.address)).to.be.equal(1);
    });

    it("Payment escrow", async function(){
        const txId = await this.escrow.getTxId(seller.address, buyer.address, this.nft.address, secret);
        const tx = await this.escrow.createEscrow(
            txId,
            0,
            paymentAmount,
            this.nft.address,
            buyer.address
        );
        await tx.wait();
        const sellerOldBalance = await ethers.provider.getBalance(seller.address);

        const txPayment = await this.escrow.connect(buyer).payEscrow(txId, {'value': paymentAmount});
        await txPayment.wait();

        expect(await this.nft.balanceOf(this.escrow.address)).to.be.equal(0);
        expect(await this.nft.balanceOf(buyer.address)).to.be.equal(1);
        expect(await this.nft.ownerOf(0)).to.be.equal(buyer.address);
        expect(await ethers.provider.getBalance(seller.address)).to.be.greaterThan(sellerOldBalance);
    });

    it("Cancle escrow", async function(){
        const txId = await this.escrow.getTxId(seller.address, buyer.address, this.nft.address, secret);
        const tx = await this.escrow.createEscrow(
            txId,
            0,
            paymentAmount,
            this.nft.address,
            buyer.address
        );
        await tx.wait();

        const txCancle = await this.escrow.cancleEscrow(txId);
        await txCancle.wait();

        expect(await this.nft.ownerOf(0)).to.be.equal(seller.address);
        expect(await this.nft.balanceOf(this.escrow.address)).to.be.equal(0)
    });

    it("Reject escrow", async function(){
        const txId = await this.escrow.getTxId(seller.address, buyer.address, this.nft.address, secret);
        const tx = await this.escrow.createEscrow(
            txId,
            0,
            paymentAmount,
            this.nft.address,
            buyer.address
        );
        await tx.wait();

        const txReject = await this.escrow.connect(buyer).rejectEscrow(txId);
        expect(await this.nft.balanceOf(this.escrow.address)).to.be.equal(0);
        expect(await this.nft.balanceOf(seller.address)).to.be.equal(1);
        expect(await this.nft.ownerOf(0)).to.be.equal(seller.address);
    })
});
