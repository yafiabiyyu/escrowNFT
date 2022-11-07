import { Chain } from '@usedapp/core';

export const AlfajoreChain: Chain = {
    chainId: 44787,
    chainName: 'Alfajores Testnet',
    isTestChain: true,
    isLocalChain: false,
    multicallAddress: '0x13c9FF7b7aD6bDFa2149CbA90c2f4fe6481ECce7',
    getExplorerAddressLink: (address) => `https://alfajores-blockscout.celo-testnet.org/address/${address}`,
    getExplorerTransactionLink: (transactionHash) => `https://alfajores-blockscout.celo-testnet.org/tx/${transactionHash}`,
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorerUrl: 'https://alfajores-blockscout.celo-testnet.org',
    nativeCurrency: { name: "Alfajores Celo", symbol: "A-CELO", decimals: 18 }
}