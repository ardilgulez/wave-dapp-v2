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

    useEffect(() => {
        checkUserAccounts(setAccount)();
    });

    useEffect(() => {
        getTotalWaveCount(setTotalWaveCount)();
    }, [account]);

    return (
        <div className="App">
            <NavBar
                account={account}
                connectWallet={connectWallet(setAccount)}
            />
            <Stats totalWaveCount={totalWaveCount} />
            <WaveBox setWaveContent={setWaveContent} />
            <WaveList waves={waves} />
        </div>
    );
};

export default App;
