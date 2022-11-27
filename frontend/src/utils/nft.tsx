import { useCall, useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";
import { getNftContract } from "./contract";


export function useFaucet() {
    const faucet = getNftContract();
    
    const { state, send } = useContractFunction(faucet, "FaucetNFT");
    const requestFaucet = send;
    const successFaucet = state.status === "Success";
    const errorFaucet = state.status === "Fail" || state.status === "Exception";
    return {
        requestFaucet,
        successFaucet,
        errorFaucet
    }
}

export function useApprove(contract: Contract) {
    const { state, send } = useContractFunction(contract, "approve");
    const approve = send;
    const successApprove = state.status === "Success";
    const errorApprove = state.status === "Fail" || state.status === "Exception";
    return {
        approve,
        successApprove,
        errorApprove
    };
}

export function useCheckOwner(contract: Contract, tokenId: string) {
    const { value, error } = useCall(
        contract && tokenId && {
            contract: contract,
            method: "ownerOf",
            args: [tokenId],
        }
    ) ?? {};
    if(error) {
        return "Error";
    }
    return value?.[0];
}

export function useGetApprove(contract: Contract, tokenId:string) {
    const { value, error } = useCall(
        contract && tokenId && {
            contract: contract,
            method: "getApproved",
            args: [tokenId]
        }
    ) ?? {};
    if(error) {
        return "Error";
    }
    return value?.[0];
}