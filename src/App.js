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
} from "./metamask-utils";

const App = () => {
    const [account, setAccount] = useState(null);
    const [totalWaveCount, setTotalWaveCount] = useState(0);
    const [waves, setWaves] = useState([]);
    const [waveContent, setWaveContent] = useState({
        message: "",
        amount: 0,
        units: "ether",
    });

    const sendWave = () => {
        wave(waveContent).then((receipt) => {
            console.log(receipt);
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
        getTotalWaveCount(setTotalWaveCount);
        getWaves().then((waves) => setWaves(waves));
    }, [account]);

    return (
        <div className="App">
            <NavBar
                account={account}
                connectWallet={connectWallet(setAccount)}
            />
            <Stats totalWaveCount={totalWaveCount} />
            <WaveBox setWaveContent={setWaveContent} sendWave={sendWave} />
            <WaveList waves={waves} />
        </div>
    );
};

export default App;
