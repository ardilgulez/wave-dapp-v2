import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Stats from "./components/Stats";
import WaveList from "./components/WaveList";

import "./App.css";
import WaveBox from "./components/WaveBox";
import {
    connectWallet,
    checkUserAccounts,
    getTotalWaveCount,
    wave,
    subscribeToNewWaves,
    getWaves,
    getHighestContribution,
    getHighestContributor,
    getLoudestContribution,
    getLoudestContributor,
    KAG_TOKEN_ADDRESS,
} from "./metamask-utils";
import DisconnectedWaveBox from "./components/DisconnectedWaveBox";

const App = () => {
    const [account, setAccount] = useState(null);
    const [totalWaveCount, setTotalWaveCount] = useState(0);
    const [highestContribution, setHighestContribution] = useState(0);
    const [highestContributor, setHighestContributor] = useState(0);
    const [loudestContribution, setLoudestContribution] = useState(0);
    const [loudestContributor, setLoudestContributor] = useState(0);
    const [waves, setWaves] = useState([]);
    const [waveContent, setWaveContent] = useState({
        message: "",
        amount: 0,
        units: "ether",
    });

    const sendWave = () => {
        wave(waveContent).then((receipt) => {
            setWaveContent({
                message: "",
                amount: 0,
                units: "ether",
            });
        });
    };

    useEffect(() => {
        checkUserAccounts((account) => {
            setAccount(account);
            subscribeToNewWaves(setWaves);
        });
    }, []);

    useEffect(() => {
        getWaves()
            .then((waves) => setWaves(waves))
            .catch((e) => {
                console.error(e);
            });
    }, [account]);

    useEffect(() => {
        getTotalWaveCount()
            .then(setTotalWaveCount)
            .catch((e) => {
                console.error(e);
            });
        getHighestContribution()
            .then(setHighestContribution)
            .catch((e) => {
                console.error(e);
            });
        getHighestContributor()
            .then(setHighestContributor)
            .catch((e) => {
                console.error(e);
            });
        getLoudestContribution()
            .then(setLoudestContribution)
            .catch((e) => {
                console.error(e);
            });
        getLoudestContributor()
            .then(setLoudestContributor)
            .catch((e) => {
                console.error(e);
            });
    }, [account, waves]);

    return (
        <div className="App">
            <NavBar
                account={account}
                connectWallet={connectWallet(setAccount)}
            />
            {account && (
                <Stats
                    totalWaveCount={totalWaveCount}
                    highestContributor={highestContributor}
                    highestContribution={highestContribution}
                    loudestContributor={loudestContributor}
                    loudestContribution={loudestContribution}
                />
            )}
            {account ? (
                <WaveBox setWaveContent={setWaveContent} sendWave={sendWave} />
            ) : (
                <DisconnectedWaveBox />
            )}
            <WaveList waves={waves} />
        </div>
    );
};

export default App;
