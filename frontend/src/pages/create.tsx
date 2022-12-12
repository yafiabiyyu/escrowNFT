import React, { ReactElement, FC, useEffect } from "react";
import { Link as LK } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { Contract, ethers, constants } from "ethers";
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
import { escrowAddress, getNftContract, nftAbi } from "../utils/contract";
import { useApprove, useCheckOwner, useGetApprove } from "../utils/nft";
import { useCreateEscrow, useGetTxId } from "../utils/escrow";

interface EscrowOrder {
    secret: string;
    buyer: string;
    nftAddress: string;
    nft: Contract;
    tokenId: string;
    paymentAmount: string;
}

interface AlertState {
    open: boolean;
    type: AlertColor;
    message: string;
}

const Home: FC<any> = (): ReactElement => {
    const [form, setForm] = React.useState(true);
    const [order, setOrder] = React.useState<EscrowOrder>({
        secret: constants.HashZero,
        buyer: "",
        nftAddress: "",
        nft: getNftContract(),
        tokenId: "",
        paymentAmount: "",
    });

    const [alert, setAlert] = React.useState<AlertState>({
        open: false,
        type: "success",
        message: "",
    });

    const { account } = useEthers();
    const { approve } = useApprove(order.nft);
    const { create, successCreate } = useCreateEscrow();

    const escrowId = useGetTxId(
        account,
        order.buyer,
        order.nftAddress,
        order.secret
    );
    const ownerStatus = useCheckOwner(order.nft, order.tokenId);
    const approvalStatus = useGetApprove(order.nft, order.tokenId);

    const handleOrderData =
        (prop: keyof EscrowOrder) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOrder({
                ...order,
                [prop]: event.target.value,
                secret: ethers.utils.keccak256(ethers.utils.randomBytes(32)),
            });
        };

    const handleNftContract = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setOrder({
                ...order,
                nftAddress: event.target.value,
                nft: new Contract(event.target.value, nftAbi),
            });
        } else {
            setOrder({
                ...order,
                nftAddress: "",
                nft: getNftContract(),
            });
        }
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

    const handleSubmit = async () => {
        if (
            order.buyer === "" ||
            order.nftAddress === "" ||
            order.tokenId === "" ||
            order.paymentAmount === ""
        ) {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "Complete the data first",
            });
        } else if (parseFloat(order.paymentAmount) === 0) {
            setAlert({
                ...alert,
                open: true,
                type: "warning",
                message: "Payment Amount cannot be 0",
            });
        } else {
            if (ownerStatus === "Error" || ownerStatus === undefined) {
                setAlert({
                    ...alert,
                    open: true,
                    type: "error",
                    message: "Invalid NFT address or token ID",
                });
            } else if(ownerStatus !== account) {
                setAlert({
                    ...alert,
                    open: true,
                    type: "warning",
                    message: "You are not the owner of the NFT",
                });
            }else if (
                ownerStatus === account &&
                approvalStatus === constants.AddressZero
            ) {
                await approve(escrowAddress, order.tokenId);
                await create(
                    escrowId,
                    order.tokenId,
                    ethers.utils.parseEther(order.paymentAmount),
                    order.nftAddress,
                    order.buyer
                );
            } else if (
                ownerStatus === account &&
                approvalStatus === escrowAddress
            ) {
                await create(
                    escrowId,
                    order.tokenId,
                    ethers.utils.parseEther(order.paymentAmount),
                    order.nftAddress,
                    order.buyer
                );
            }
        }
    };

    React.useEffect(() => {
        if (successCreate) {
            setAlert({
                ...alert,
                open: true,
                type: "success",
                message: "Transaction Successful",
            });
            setForm(false);
        }
    }, [successCreate]);

    return (
        <Box
            sx={{
                mt: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert severity={alert.type}>{alert.message}</Alert>
            </Snackbar>
            {form && (
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
                                        id="seller"
                                        label="Seller Address"
                                        value=""
                                        size="medium"
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                )}
                                {account && (
                                    <TextField
                                        name="seller"
                                        id="seller"
                                        label="Seller Address"
                                        value={account}
                                        size="medium"
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="buyer"
                                    id="buyer"
                                    label="Buyer Address"
                                    size="medium"
                                    fullWidth
                                    onChange={handleOrderData("buyer")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="nftAddress"
                                    id="nftAddress"
                                    label="NFT Address"
                                    size="medium"
                                    fullWidth
                                    onChange={handleNftContract}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="tokenId"
                                    id="tokenId"
                                    label="Token ID"
                                    size="medium"
                                    fullWidth
                                    onChange={handleOrderData("tokenId")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="paymentAmount"
                                    id="paymentAmount"
                                    label="Payment Amount"
                                    size="medium"
                                    fullWidth
                                    onChange={handleOrderData("paymentAmount")}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            size="medium"
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Create Escrow
                        </Button>
                    </Box>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/info" variant="body2">
                                Already have an escrow id? Check status
                            </Link>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {!form && (
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
                                    value={escrowId}
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
