const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WaveContract", function () {
    let kagToken;
    let waveContract;

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

        const WaveContract = await ethers.getContractFactory("WaveContract");
        waveContract = await WaveContract.deploy(kagToken.address);
        await waveContract.deployed();

        console.log(
            `WaveContract is successfully deployed to: ${waveContract.address}`
        );

        const transferBalanceTX = await kagToken.transfer(
            waveContract.address,
            ethers.utils.parseEther("10000")
        );

        // wait until the transaction is mined
        await transferBalanceTX.wait();
    });

    it("Should create KAGToken and WaveContract, then transfer the balance of KAGToken owner to WaveContract", async function () {
        const [deployer] = await ethers.getSigners();
        expect(await waveContract.owner()).to.equal(deployer.address);
        expect(await kagToken.balanceOf(deployer.address)).to.equal(0);
        expect(await kagToken.balanceOf(waveContract.address)).to.equal(
            ethers.utils.parseEther("10000")
        );
    });

    it("Should be able to wave with ether", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.wave("Hi there!", {
            value: ethers.utils.parseEther("1"),
        });
        const receipt = await waveTxn.wait();
        const newWaveEvents = receipt.events.filter(
            (x) => x.event == "NewWave"
        );
        expect(newWaveEvents.length).to.equal(1);

        expect(await ethers.provider.getBalance(waveContract.address)).to.equal(
            ethers.utils.parseEther("1")
        );
        const deployerBalance = await deployer.getBalance();

        expect(
            ethers.utils.parseEther("9999").toBigInt() >
                deployerBalance.toBigInt()
        ).to.be.true;
    });

    it("Should not be able to receive KAG tokens after waving without value", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.wave("Hi there!", {
            value: 0,
        });
        const receipt = await waveTxn.wait();
        const newWaveEvents = receipt.events.filter(
            (x) => x.event == "NewWave"
        );
        expect(newWaveEvents.length).to.equal(1);

        const totalWaveCount = await waveContract.totalWaveCount();
        expect(totalWaveCount).to.equal(1);

        const amountWavedByDeployer = await waveContract.amountWavedBy(
            deployer.address
        );
        expect(amountWavedByDeployer.toBigInt() == ethers.utils.parseEther("0"))
            .to.be.true;

        const waveCountOfDeployer = await waveContract.waveCountOf(
            deployer.address
        );
        expect(waveCountOfDeployer).to.equal(1);

        const deployerKagBalance = await kagToken.balanceOf(deployer.address);
        expect(deployerKagBalance).to.equal(0);
    });

    it("Should be able to receive KAG tokens after waving with value", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.wave("Hi there!", {
            value: ethers.utils.parseEther("1"),
        });
        const receipt = await waveTxn.wait();
        const newWaveEvents = receipt.events.filter(
            (x) => x.event == "NewWave"
        );
        expect(newWaveEvents.length).to.equal(1);

        const totalWaveCount = await waveContract.totalWaveCount();
        expect(totalWaveCount).to.equal(1);

        const amountWavedByDeployer = await waveContract.amountWavedBy(
            deployer.address
        );
        expect(amountWavedByDeployer.toBigInt() == ethers.utils.parseEther("1"))
            .to.be.true;

        const waveCountOfDeployer = await waveContract.waveCountOf(
            deployer.address
        );
        expect(waveCountOfDeployer).to.equal(1);

        const deployerKagBalance = await kagToken.balanceOf(deployer.address);
        expect(deployerKagBalance).to.equal(1);
    });

    it("Should the owner be able to withdraw", async () => {
        const [deployer, acc2] = await ethers.getSigners();
        const waveTxn = await waveContract.connect(acc2).wave("Hi there!", {
            value: ethers.utils.parseEther("1000"),
        });
        await waveTxn.wait();

        const withdrawTxn = await waveContract.connect(deployer).withdraw();
        await withdrawTxn.wait();

        expect(
            (await deployer.getBalance()).toBigInt() >
                ethers.utils.parseEther("10000").toBigInt()
        ).to.be.true;
    });

    it("Should the non-owner not be able to withdraw", async () => {
        const [deployer, acc2] = await ethers.getSigners();
        const waveTxn = await waveContract.connect(deployer).wave("Hi there!", {
            value: ethers.utils.parseEther("1000"),
        });
        await waveTxn.wait();

        await expect(waveContract.connect(acc2).withdraw()).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });
});
