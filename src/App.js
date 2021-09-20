import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Stats from "./components/Stats";

import "./App.css";
import WaveBox from "./components/WaveBox";
import { connectWallet, checkUserAccounts } from "./metamask-utils";

const App = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        checkUserAccounts(window, setAccount)();
    });

    return (
        <div className="App">
            <NavBar
                account={account}
                connectWallet={connectWallet(window, setAccount)}
            />
            <Stats />
            <WaveBox />
        </div>
    );
};

export default App;
