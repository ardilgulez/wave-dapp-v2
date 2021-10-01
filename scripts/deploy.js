const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer, acc2] = await ethers.getSigners();

    console.log(`Deployer address: ${deployer.address}`);

    const KAGToken = await hre.ethers.getContractFactory("KAGToken");
    const kagToken = await KAGToken.connect(deployer).deploy(
        hre.ethers.utils.parseEther("10000")
    );

    await kagToken.deployed();

    console.log("KAGToken deployed to: ", kagToken.address);

    console.log(await kagToken.totalSupply());

    const WaveContract = await hre.ethers.getContractFactory("WaveContract");
    const waveContract = await WaveContract.connect(deployer).deploy(
        kagToken.address
    );

    await waveContract.deployed();
    console.log("WaveContract deployed to: ", waveContract.address);

    await kagToken.connect(deployer).makeMinter(waveContract.address);

    let deployerKagBalance = await kagToken.balanceOf(deployer.address);
    console.log(`Deployer KAG Balance is: ${deployerKagBalance}`);
    let waveContractKagBalance = await kagToken.balanceOf(waveContract.address);
    console.log(`Wave Contract KAG Balance is: ${waveContractKagBalance}`);

    await kagToken
        .connect(deployer)
        .transfer(waveContract.address, deployerKagBalance);

    deployerKagBalance = await kagToken.balanceOf(deployer.address);
    console.log(`Deployer KAG Balance is: ${deployerKagBalance}`);
    waveContractKagBalance = await kagToken.balanceOf(waveContract.address);
    console.log(`Wave Contract KAG Balance is: ${waveContractKagBalance}`);

    const networkObject = {
        name: hre.network.name,
        kagTokenAddress: kagToken.address,
        waveContractAddress: waveContract.address,
    };
    fs.writeFileSync(
        path.join(
            __dirname,
            "..",
            "src",
            "networks",
            `${hre.network.name}.config.json`
        ),
        JSON.stringify(networkObject)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
