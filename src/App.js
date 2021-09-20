import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Stats from "./components/Stats";
import WaveList from "./components/WaveList";

import "./App.css";
import WaveBox from "./components/WaveBox";
import { connectWallet, checkUserAccounts } from "./metamask-utils";

const App = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        checkUserAccounts(window, setAccount)();
    });

    const waves = [
        {
            from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            message: "Hi!",
            timestamp: new Date().getTime() / 1000,
        },
        {
            from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            message: "Hi!",
            timestamp: new Date().getTime() / 1000,
        },
    ];

    return (
        <div className="App">
            <NavBar
                account={account}
                connectWallet={connectWallet(window, setAccount)}
            />
            <Stats />
            <WaveBox />
            <WaveList waves={waves} />
        </div>
    );
};

export default App;
