import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";

import "./App.css";

const App = () => {
    const [account, setAccount] = useState(null);
    const connectWallet = async () => {
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

    const checkUserAccounts = async () => {
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
        }
    };

    useEffect(() => {
        checkUserAccounts();
    });

    return (
        <div className="App">
            <NavBar account={account} connectWallet={connectWallet} />
        </div>
    );
};

export default App;
