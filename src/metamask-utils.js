import { ethers } from "ethers";
import { abi } from "./artifacts/contracts/WaveContract.sol/WaveContract.json";
import networkConfig from "./networks/localhost.config.json";

export const WAVE_CONTRACT_ADDRESS = networkConfig.waveContractAddress;
export const KAG_TOKEN_ADDRESS = networkConfig.kagTokenAddress;

export const connectWallet = (setAccount) => async () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        }
    }
};

export const checkUserAccounts = async (callback) => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        let accounts = await ethereum.request({
            method: "eth_accounts",
        });
        if (accounts.length > 0) {
            callback(accounts[0]);
        }

        ethereum.on("accountsChanged", async () => {
            accounts = await ethereum.enable();
            const account = accounts[0];
            callback(account);
        });

        ethereum.on("connect", async () => {
            accounts = await ethereum.enable();
            const account = accounts[0];
            callback(account);
        });
    }
};

export const getTotalWaveCount = async () => {
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
        return new Promise((resolve, reject) => {
            resolve(totalWaveCount.toNumber());
        });
    }
};

export const getHighestContribution = async () => {
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
        const highestContribution = await waveContract.highestContribution();
        return new Promise((resolve, reject) => {
            resolve(ethers.utils.formatEther(highestContribution));
        });
    }
};

export const getHighestContributor = async () => {
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
        const highestContributor = await waveContract.highestContributor();
        return new Promise((resolve, reject) => {
            resolve(highestContributor);
        });
    }
};

export const getLoudestContribution = async () => {
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
        const highestContribution = await waveContract.loudestContribution();
        return new Promise((resolve, reject) => {
            resolve(highestContribution.toString());
        });
    }
};

export const getLoudestContributor = async () => {
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
        const highestContributor = await waveContract.loudestContributor();
        return new Promise((resolve, reject) => {
            resolve(highestContributor);
        });
    }
};

export const wave = async ({ message, amount, unit }) => {
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
        return new Promise((resolve, reject) => {
            resolve(receipt);
        });
    }
};

export const getWaves = async () => {
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
        const waves = await waveContract.getWaves();
        return new Promise((resolve, reject) => {
            resolve([...waves].reverse());
        });
    }
};

export const subscribeToNewWaves = async (setWaves) => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected");
    } else {
        const addIfNotExists = (waves, newWave) => {
            const ids = waves.map((wave) => wave.id.toNumber());
            if (ids.indexOf(newWave.id.toNumber()) < 0) {
                return [newWave, ...waves];
            } else {
                return waves;
            }
        };
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
            WAVE_CONTRACT_ADDRESS,
            abi,
            signer
        );
        waveContract.on("NewWave", (id, from, message, amount, timestamp) => {
            setWaves((oldWaves) =>
                addIfNotExists(oldWaves, {
                    id,
                    from,
                    message,
                    amount,
                    timestamp,
                })
            );
        });
    }
};
