// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy

    // const Greeter = await hre.ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("HELLO HARDHAT");
    // await greeter.deployed();
    // console.log("Greeter deployed to: ", greeter.address);
    // console.log(await greeter.greet());

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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
