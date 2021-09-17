const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KAGToken", function () {
    let kagToken;

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners();
        console.log(deployer);
        console.log(deployer.address);

        const KAGToken = await ethers.getContractFactory("KAGToken");
        kagToken = await KAGToken.deploy(ethers.utils.parseEther("10000"));
        await kagToken.deployed();
        console.log(
            `KAGToken is successfully deployed to: ${kagToken.address}`
        );
    });

    it("Should the deployer have 10000 ether of KAGToken after deployment", async () => {
        const [deployer] = await ethers.getSigners();
        const deployerBalance = await kagToken.balanceOf(deployer.address);
        expect(deployerBalance.toBigInt()).to.equal(
            ethers.utils.parseEther("10000").toBigInt()
        );
    });

    it("Should the deployer be able to mint for himself", async () => {
        const [deployer] = await ethers.getSigners();
        const mintTxn = await kagToken.mint(
            deployer.address,
            ethers.utils.parseEther("1")
        );
        await mintTxn.wait();
        const deployerBalance = await kagToken.balanceOf(deployer.address);
        expect(deployerBalance.toBigInt()).to.equal(
            ethers.utils.parseEther("10001").toBigInt()
        );
    });

    it("Should the deployer be able to mint for someone else", async () => {
        const [deployer, acc2] = await ethers.getSigners();
        const mintTxn = await kagToken
            .connect(deployer)
            .mint(acc2.address, ethers.utils.parseEther("1"));
        await mintTxn.wait();
        const acc2Balance = await kagToken.balanceOf(acc2.address);
        expect(acc2Balance.toBigInt()).to.equal(
            ethers.utils.parseEther("1").toBigInt()
        );
    });

    it("Should a random person not be able to mint", async () => {
        const [_, acc2] = await ethers.getSigners();
        await expect(
            kagToken
                .connect(acc2)
                .mint(acc2.address, ethers.utils.parseEther("1"))
        ).to.be.reverted;
    });

    it("Should the deployer be able to make someone else a minter", async () => {
        const [deployer, acc2] = await ethers.getSigners();

        await expect(kagToken.connect(deployer).makeMinter(acc2.address)).to.not
            .be.reverted;
    });

    it("Should a random person not be able to make someone else a minter", async () => {
        const [_, acc2, acc3] = await ethers.getSigners();
        await expect(kagToken.connect(acc2).makeMinter(acc3.address)).to.be
            .reverted;
    });

    it("Should a minter be able to mint", async () => {
        const [deployer, acc2] = await ethers.getSigners();
        const makeMinterTxn = await kagToken
            .connect(deployer)
            .makeMinter(acc2.address);
        await makeMinterTxn.wait();
        const mintTxn = await kagToken.connect(acc2).mint(acc2.address, 1);
        await mintTxn.wait();
        expect(await kagToken.connect(acc2).balanceOf(acc2.address)).to.equal(
            1
        );
    });
});
