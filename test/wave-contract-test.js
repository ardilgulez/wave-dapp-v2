const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WaveContract", function () {
    let kagToken;
    let waveContract;
    const INITIAL_KAG_AMOUNT = 1000;

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners();
        console.log(deployer);
        console.log(deployer.address);

        const KAGToken = await ethers.getContractFactory("KAGToken");
        kagToken = await KAGToken.deploy(INITIAL_KAG_AMOUNT);
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

        const makeMinterTxn = kagToken.makeMinter(waveContract.address);

        const transferBalanceTX = await kagToken.transfer(
            waveContract.address,
            INITIAL_KAG_AMOUNT
        );

        // wait until the transaction is mined
        await transferBalanceTX.wait();
    });

    it("Should create KAGToken and WaveContract, then transfer the balance of KAGToken owner to WaveContract", async function () {
        const [deployer] = await ethers.getSigners();
        expect(await waveContract.owner()).to.equal(deployer.address);
        expect(await kagToken.balanceOf(deployer.address)).to.equal(0);
        expect(await kagToken.balanceOf(waveContract.address)).to.equal(
            INITIAL_KAG_AMOUNT
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
        expect(
            amountWavedByDeployer.toBigInt() ===
                ethers.utils.parseEther("0").toBigInt()
        ).to.be.true;

        const waveCountOfDeployer = await waveContract.waveCountOf(
            deployer.address
        );
        expect(waveCountOfDeployer).to.equal(1);

        const deployerKagBalance = await kagToken.balanceOf(deployer.address);
        expect(deployerKagBalance).to.equal(0);
    });

    it("Should be able to receive KAG tokens after waving with value", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.connect(deployer).wave("Hi there!", {
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
        expect(
            amountWavedByDeployer.toBigInt() ===
                ethers.utils.parseEther("1").toBigInt()
        ).to.be.true;

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

    it("Should list waves", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.connect(deployer).wave("Hi there!", {
            value: ethers.utils.parseEther("1000"),
        });
        await waveTxn.wait();

        const waves = await waveContract.getWaves();
        expect(waves.length).to.equal(1);
        const wave = waves[0];
        expect(wave.from).to.equal(deployer.address);
        expect(
            wave.amount.toBigInt() ===
                ethers.utils.parseEther("1000").toBigInt()
        ).to.be.true;
    });

    it("Should retrieve kagTokenAddress", async () => {
        const kagTokenAddress = await waveContract.kagTokenAddress();
        expect(kagTokenAddress).to.equal(kagToken.address);
    });

    it("Should WaveContract mint new KAGTokens when it has a balance of lower than 1000", async () => {
        const [deployer] = await ethers.getSigners();
        const waveTxn = await waveContract.connect(deployer).wave("Hi there!", {
            value: ethers.utils.parseEther("1000"),
        });
        await waveTxn.wait();

        const waveContractKagBalance = await kagToken.balanceOf(
            waveContract.address
        );
        expect(waveContractKagBalance).to.equal(1999);
    });
});
