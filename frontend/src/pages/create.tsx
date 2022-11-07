import React, { ReactElement, FC } from "react";
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
import {
    abi,
    defaultNFT,
    escrowContract,
    useApprove,
    useGetApproval,
    useOwnerOf,
} from "../utils/nft";
import { useEthers, useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";

interface StateData {
    buyer: string;
    contract: Contract;
    nftAddress: string;
    tokenId: string;
    paymentAmount: string;
    approveStatus: boolean;
}

interface StateSnackbar {
    open: boolean;
    type: AlertColor;
    message: string;
}

const Home: FC<any> = (): ReactElement => {
    const { account } = useEthers();
    const [alert, setAlert] = React.useState<StateSnackbar>({
        open: false,
        type: "success",
        message: ""
    });

    const [values, setValues] = React.useState<StateData>({
        buyer: "",
        contract: new Contract(defaultNFT, abi),
        nftAddress: "",
        tokenId: "",
        paymentAmount: "",
        approveStatus: true,
    });
    const ownerStatus = useOwnerOf(values.contract, values.tokenId);
    const approvalStatus = useGetApproval(values.contract, values.tokenId);
    const {success, error, send} = useApprove(values.contract);

    const handleInputChange =
        (prop: keyof StateData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };

    const handleContractChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValues({
            ...values,
            contract: new Contract(event.target.value, abi),
            nftAddress: event.target.value,
        });
        console.log(values.contract);
    };

    React.useEffect(() => {
        if(ownerStatus === "error") {
            setAlert({...alert, open:true, type:"error", message:"wrong contract address or token id"})
        } else if(ownerStatus === account || ownerStatus === undefined) {
            setAlert({...alert, open:false, type:"success", message:""})
        }else {
            console.log(ownerStatus);
            setAlert({...alert, open:true, type:"warning", message:`You are not the owner of Token ID : ${values.tokenId}`});
        }
    }, [ownerStatus])

    React.useEffect(() => {
        if(approvalStatus !== escrowContract) {
            setValues({...values, approveStatus:false});
        }else {
            setValues({...values, approveStatus:true});
        }
    },[approvalStatus])

    const handleApprove = async () => {
        await send(escrowContract, values.tokenId);
        console.log("Berhasil Minting");
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Snackbar open={alert.open} autoHideDuration={7000}>
                <Alert severity={alert.type}>{alert.message}</Alert>
            </Snackbar>
            <Typography component="h1" variant="h5">
                Create Escrow
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
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
                                disabled
                                value={account}
                                size="medium"
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="buyer"
                            onChange={handleInputChange("buyer")}
                            fullWidth
                            id="buyer"
                            label="Buyer Address"
                            size="medium"
                            required
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="nft"
                            onChange={handleContractChange}
                            fullWidth
                            required
                            id="nft"
                            label="NFT Address"
                            size="medium"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="tokenId"
                            onChange={handleInputChange("tokenId")}
                            fullWidth
                            required
                            id="tokenId"
                            label="Token ID"
                            size="medium"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="paymentAmount"
                            onChange={handleInputChange("paymentAmount")}
                            fullWidth
                            required
                            id="paymentAmount"
                            label="Payment Amount"
                            size="medium"
                        />
                    </Grid>
                </Grid>
                {values.approveStatus && (
                    <Button
                        size="large"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Create Escrow
                    </Button>
                )}
                {!values.approveStatus && (
                    <Button
                        size="large"
                        onClick={handleApprove}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Approve NFT
                    </Button>
                )}
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="info/" variant="body2">
                            Already have an escrow id? Check status
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Home;