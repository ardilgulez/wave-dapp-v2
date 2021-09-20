export const connectWallet = (window, setAccount) => async () => {
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

export const checkUserAccounts = (window, setAccount) => async () => {
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
