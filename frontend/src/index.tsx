import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AlfajoreChain } from "./utils/AlfajoareChain";
import { DAppProvider, Config } from "@usedapp/core";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const config: Config = {
    readOnlyChainId: AlfajoreChain.chainId,
    readOnlyUrls: {
        [AlfajoreChain.chainId]: "https://alfajores-forno.celo-testnet.org",
    },
    networks: [AlfajoreChain],
};
root.render(
    <React.StrictMode>
        <DAppProvider config={config}>
            <App />
        </DAppProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
