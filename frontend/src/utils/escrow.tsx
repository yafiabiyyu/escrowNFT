import { Contract, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { Falsy, useCall, useContractFunction, useEthers } from "@usedapp/core";

export const escrowContract = "0x1dbA2902A43d2e0af4DF890Ae22FFf9CE5B79108";
export const escrowAbi = new Interface([
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_fee",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_timestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sellerAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_buyerAddress",
                type: "address",
            },
        ],
        name: "CancleEscrow",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_timestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_seller",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_buyer",
                type: "address",
            },
        ],
        name: "NewEscrow",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_timestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_paymentAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sellerAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_buyerAddress",
                type: "address",
            },
        ],
        name: "PaymentEscrow",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_timestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sellerAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_buyerAddress",
                type: "address",
            },
        ],
        name: "RejectEscrow",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
        ],
        name: "cancleEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_paymentAmount",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "_nftAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_buyerAddress",
                type: "address",
            },
        ],
        name: "createEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "escrowOrder",
        outputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "paymentAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "nftAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "buyerAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "sellerAddress",
                type: "address",
            },
            {
                internalType: "enum escrowNFT.Status",
                name: "status",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sellerAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_buyerAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_nftAddress",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "_secret",
                type: "bytes",
            },
        ],
        name: "getTxId",
        outputs: [
            {
                internalType: "uint256",
                name: "txId",
                type: "uint256",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
        ],
        name: "payEscrow",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_txId",
                type: "uint256",
            },
        ],
        name: "rejectEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_fee",
                type: "uint256",
            },
        ],
        name: "updateFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]);
const contract = new Contract(escrowContract, escrowAbi);


export function useGetTxId(seller:string | undefined, buyer:string, nftAddress:string) {
    const { value, error } = useCall(
        seller && buyer && nftAddress && {
            contract:contract,
            method: "getTxId",
            args:[seller, buyer, nftAddress, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("yafiabiyyu"))]
        }
    ) ?? {};
    if(error) {
        console.error(error.message);
        return "error";
    }
    return value?.[0].toString();
}

export function useCreateEscrow() {
    const { state, send } = useContractFunction(contract, "createEscrow");
    const successCreate = state.status === "Success";
    const errorCreate = state.status === "Fail" || state.status === "Exception";
    const sendCreate = send;
    return {
        successCreate,
        errorCreate,
        sendCreate,
    };
}

export function usePayEscrow() {
    const { state, send } = useContractFunction(contract, "createEscrow");
    const successCreate = state.status === "Success";
    const errorCreate = state.status === "Fail" || state.status === "Exception";
    const sendPay = send;
    return {
        successCreate,
        errorCreate,
        sendPay,
    };
}

export function useCancleEscrow() {
    const { state, send } = useContractFunction(contract, "createEscrow");
    const successCreate = state.status === "Success";
    const errorCreate = state.status === "Fail" || state.status === "Exception";
    const sendCancle = send;
    return {
        successCreate,
        errorCreate,
        sendCancle,
    };
}

export function useRejectEscrow() {
    const { state, send } = useContractFunction(contract, "createEscrow");
    const successCreate = state.status === "Success";
    const errorCreate = state.status === "Fail" || state.status === "Exception";
    const sendReject = send;
    return {
        successCreate,
        errorCreate,
        sendReject,
    };
}