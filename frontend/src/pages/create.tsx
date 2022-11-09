import React, { ReactElement, FC } from "react";
import {
    useApprove,
    useGetApprove,
    useOwnerOf,
    contractNFT,
    nftAbi,
} from "../utils/nft";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Link,
    Alert,
    Snackbar,
    AlertColor,
} from "@mui/material";
import { useEthers } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import { escrowContract, useGetTxId, useCreateEscrow } from "../utils/escrow";
import { Link as LK } from "react-router-dom";

interface EscrowState {
    showForm: boolean;
    showApprove: boolean;
}

interface EscrowOrder {
    buyer: string;
    contract: Contract;
    nftAddress: string;
    tokenId: string;
    paymentAmount: string;
}

interface StateSnackbar {
    open: boolean;
    type: AlertColor;
    message: string;
}

const Home: FC<any> = (): ReactElement => {
    const { account } = useEthers();
    const [order, setOrder] = React.useState<EscrowOrder>({
        buyer: "",
        contract: contractNFT,
        nftAddress: "",
        tokenId: "",
        paymentAmount: "",
    });

    const ownerStatus = useOwnerOf(order.contract, order.tokenId, account);
    const approveStatus = useGetApprove(order.contract, order.tokenId);
    const { successApprove, errorApprove, approve } = useApprove(
        order.contract
    );
    const txId = useGetTxId(account, order.buyer, order.nftAddress);
    const { successCreate, errorCreate, sendCreate } = useCreateEscrow();

    const [values, setValues] = React.useState<EscrowState>({
        showForm: true,
        showApprove: false,
    });

    const [alert, setAlert] = React.useState<StateSnackbar>({
        open: false,
        type: "success",
        message: "",
    });

    const handleOrderData =
        (prop: keyof EscrowOrder) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOrder({ ...order, [prop]: event.target.value });
        };

    const handleContractData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder({
            ...order,
            contract: new Contract(event.target.value, nftAbi),
            nftAddress: event.target.value,
        });
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    const handleApproveButton = async () => {
        await approve(escrowContract, order.tokenId);
    };

    const handleCreateButton = async () => {
        if (
            order.buyer !== "" &&
            order.nftAddress !== "" &&
            order.tokenId !== "" &&
            order.paymentAmount !== ""
        ) {
            await sendCreate(
                txId,
                order.tokenId,
                ethers.utils.parseEther(order.paymentAmount),
                order.nftAddress,
                order.buyer
            );
        } else {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "Complete the data first",
            });
        }
    };

    React.useEffect(() => {
        if (!approveStatus && approveStatus !== undefined) {
            setValues({
                ...values,
                showApprove: true,
            });
        } else if (approveStatus || approveStatus === undefined) {
            setValues({
                ...values,
                showApprove: false,
            });
        }
    }, [approveStatus]);

    React.useEffect(() => {
        if (ownerStatus === "Error") {
            setAlert({
                ...alert,
                open: true,
                type: "error",
                message: "Incorrect address or token ID",
            });
        } else if (!ownerStatus && ownerStatus !== undefined) {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "You are not the owner",
            });
        } else if (ownerStatus || ownerStatus === undefined) {
            setAlert({
                ...alert,
                open: false,
                type: "success",
                message: "",
            });
        }
    }, [ownerStatus]);

    React.useEffect(() => {
        if (successApprove) {
            setAlert({
                ...alert,
                open: true,
                type: "success",
                message: "Transaction Successful",
            });
        } else if (errorApprove) {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "Transaction failed",
            });
        } else {
            setAlert({
                ...alert,
                open: false,
                type: "success",
                message: "",
            });
        }
    }, [successApprove, errorApprove]);

    React.useEffect(() => {
        if (successCreate) {
            setAlert({
                ...alert,
                open: true,
                type: "success",
                message: "Transaction Successful",
            });
            setValues({ ...values, showForm: false });
        } else if (errorCreate) {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "Transaction failed",
            });
        } else {
            setAlert({
                ...alert,
                open: false,
                type: "success",
                message: "",
            });
        }
    });

    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Snackbar open={alert.open} autoHideDuration={5000}>
                <Alert severity={alert.type}>{alert.message}</Alert>
            </Snackbar>
            {values.showForm && (
                <React.Fragment>
                    <Typography component="h1" variant="h5">
                        Create Escrow
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {!account && (
                                    <TextField
                                        name="seller"
                                        fullWidth
                                        id="seller"
                                        label="Seller Address"
                                        InputProps={{ readOnly: true }}
                                        value=""
                                        size="medium"
                                    />
                                )}
                                {account && (
                                    <TextField
                                        name="seller"
                                        fullWidth
                                        id="seller"
                                        label="Seller Address"
                                        InputProps={{ readOnly: true }}
                                        value={account}
                                        size="medium"
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleOrderData("buyer")}
                                    name="buyer"
                                    fullWidth
                                    id="buyer"
                                    label="Buyer Address"
                                    size="medium"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleContractData}
                                    name="nftAddress"
                                    fullWidth
                                    id="nftAddress"
                                    label="NFT Address"
                                    size="medium"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={handleOrderData("tokenId")}
                                    name="tokenId"
                                    fullWidth
                                    id="tokenId"
                                    label="Token ID"
                                    size="medium"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={handleOrderData("paymentAmount")}
                                    name="paymentAmount"
                                    fullWidth
                                    id="paymentAmount"
                                    label="Payment Amount"
                                    size="medium"
                                />
                            </Grid>
                        </Grid>
                        {!values.showApprove && (
                            <Button
                                onClick={handleCreateButton}
                                size="large"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Create Escrow
                            </Button>
                        )}
                        {values.showApprove && (
                            <Button
                                onClick={handleApproveButton}
                                size="large"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Approve NFT
                            </Button>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/info" variant="body2">
                                    Already have an escrow id? Check status
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>
            )}
            {!values.showForm && (
                <React.Fragment>
                    <Alert sx={{ mb: 3 }} variant="filled" severity="warning">
                        Please save your Escrow Id
                    </Alert>
                    <Typography component="h1" variant="h5">
                        Escrow Order
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {!account && (
                                    <TextField
                                        name="seller"
                                        fullWidth
                                        id="seller"
                                        label="Seller Address"
                                        disabled
                                        value=""
                                        size="medium"
                                    />
                                )}
                                {account && (
                                    <TextField
                                        name="seller"
                                        fullWidth
                                        id="seller"
                                        label="Seller Address"
                                        InputProps={{ readOnly: true }}
                                        value={account}
                                        size="medium"
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="escrowId"
                                    fullWidth
                                    id="escrowId"
                                    label="Escrow ID"
                                    size="medium"
                                    value={txId}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            component={LK}
                            to="/info"
                            size="large"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Chek Escrow Order
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
};

export default Home;
