import { ethers } from "ethers";
import { abi } from "./artifacts/contracts/WaveContract.sol/WaveContract.json";

require("dotenv").config();

const WAVE_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const connectWallet = (setAccount) => async () => {
    console.log(process.env);
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
    }
};

export const checkUserAccounts = (setAccount) => async () => {
    console.log(process.env);
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        let accounts = await ethereum.request({
            method: "eth_accounts",
        });
        setAccount(accounts[0]);

        ethereum.on("accountsChanged", async () => {
            accounts = await ethereum.enable();
            const account = accounts[0];
            setAccount(account);
        });

        ethereum.on("connect", async () => {
            accounts = await ethereum.enable();
            const account = accounts[0];
            setAccount(account);
        });
    }
};

export const getTotalWaveCount = (setTotalWaveCount) => async () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
            WAVE_CONTRACT_ADDRESS,
            abi,
            signer
        );
        const totalWaveCount = await waveContract.totalWaveCount();
        setTotalWaveCount(totalWaveCount.toNumber());
    }
};

export const getKagTokenAddress = (setKagTokenAddress) => async () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
            WAVE_CONTRACT_ADDRESS,
            abi,
            signer
        );
        const kagTokenAddress = await waveContract.kagTokenAddress();
        setKagTokenAddress(kagTokenAddress.toString());
    }
};

const wave = async ({ message, amount, unit }) => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
            WAVE_CONTRACT_ADDRESS,
            abi,
            signer
        );
        const waveTxn = await waveContract.wave(message, {
            value: ethers.utils.parseUnits(amount.toString(), unit),
        });
        const receipt = await waveTxn.wait();
        return new Promise(receipt);
    }
};
