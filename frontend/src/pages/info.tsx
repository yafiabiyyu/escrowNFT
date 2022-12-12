import React, { ReactElement, FC, Fragment } from "react";
import {
    Box,
    Typography,
    Grid,
    Link,
    TextField,
    Button,
    Skeleton,
    InputAdornment,
    AlertColor,
    Alert,
    Snackbar,
} from "@mui/material";
import { useCancleEscrow, useOrderData, useRejectEscrow, usePayEscrow } from "../utils/escrow";
import dayjs, { Dayjs } from "dayjs";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface EscrowOrder {
    escrowId: string;
    tokenId: string;
    paymentAmount: string;
    deadline: string;
    deadlineObject: Dayjs | null;
    nftAddress: string;
    buyerAddress: string;
    sellerAddress: string;
    status: string;
}

const Tx: FC<any> = (): ReactElement => {
    const { account } = useEthers();
    const timer = React.useRef<number>();
    const [search, setSearch] = React.useState(true);
    const [data, setData] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [order, setOrder] = React.useState<EscrowOrder>({
        escrowId: "",
        tokenId: "",
        paymentAmount: "",
        deadline: "",
        deadlineObject: null,
        nftAddress: "",
        buyerAddress: "",
        sellerAddress: "",
        status: ""
    });

    const escrowOrder = useOrderData(order.escrowId);
    const { cancle, successCancle, errorCancle } = useCancleEscrow();
    const { reject, successReject, errorReject } = useRejectEscrow();
    const { pay, successPay, errorPay } = usePayEscrow();

    const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder({ ...order, escrowId: event.target.value });
    }

    const handleButtonSearch = () => {
        setSearch(false);
        setData(true);
        setLoading(true);
        timer.current = window.setTimeout(() => {
            setLoading(false);
        }, 5000)
    }

    const handleCancle = async () => {
        await cancle(order.escrowId);
    }

    const handleReject = async () => {
        await reject(order.escrowId);
    }

    const handlePay = async () => {
        await pay(order.escrowId, {value:order.paymentAmount});
    }

    React.useEffect(() => {
        let status = ["Pending", "Accepted", "Rejected", "Canceled"];
        setOrder({
            ...order,
            tokenId: escrowOrder?.[0].toString(),
            paymentAmount: escrowOrder?.[1].toString(),
            deadline: escrowOrder?.[2].toString(),
            deadlineObject: dayjs.unix(escrowOrder?.[2].toNumber()),
            nftAddress: escrowOrder?.[3],
            buyerAddress: escrowOrder?.[4],
            sellerAddress: escrowOrder?.[5],
            status: status[escrowOrder?.[6]]
        });
    }, [escrowOrder])

    return (
        <Box sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Typography component="h1" variant="h5">Escrow Order</Typography>
            {search && !data && (
                <React.Fragment>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Escrow ID"
                                    name="escrowId"
                                    id="escrowId"
                                    size="medium"
                                    fullWidth
                                    onChange={handleOnchange} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    fullWidth
                                    onClick={handleButtonSearch}>Search Escrow</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>
            )}
            {!search && data && (
                <React.Fragment>
                    <Box sx={{ mt: 3 }}>
                        {loading ? (
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Skeleton
                                        variant="rounded"
                                        width={140}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Skeleton
                                        variant="rounded"
                                        width={140}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Skeleton
                                        variant="rounded"
                                        width={140}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        variant="rounded"
                                        width={524}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        variant="rounded"
                                        width={524}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        variant="rounded"
                                        width={524}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        variant="rounded"
                                        width={524}
                                        height={23}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        variant="rounded"
                                        width={524}
                                        height={23}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Escrow ID"
                                        name="escrowId"
                                        id="escrowId"
                                        size="medium"
                                        value={order.escrowId}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Deadline"
                                            readOnly
                                            value={order.deadlineObject}
                                            onChange={(test) => {
                                                setOrder({ ...order, deadlineObject: test })
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params}
                                                    fullWidth />
                                            )} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Seller Address"
                                        name="sellerAddress"
                                        id="sellerAddress"
                                        size="medium"
                                        value={order.sellerAddress}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Buyer Address"
                                        name="buyerAddress"
                                        id="buyerAddress"
                                        size="medium"
                                        value={order.buyerAddress}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="NFT Address"
                                        name="nfgAddress"
                                        id="nftAddress"
                                        size="medium"
                                        value={order.nftAddress}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Token ID"
                                        name="tokenId"
                                        id="tokenId"
                                        size="medium"
                                        value={order.tokenId}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Payment Amount"
                                        name="paymentAmount"
                                        id="paymentAmount"
                                        size="medium"
                                        value={ethers.utils.formatEther(order.paymentAmount)}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: <InputAdornment position="end">Celo</InputAdornment>
                                        }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Escrow Status"
                                        name="escrowId"
                                        id="escrowId"
                                        size="medium"
                                        value={order.status}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                {account === order.sellerAddress && Date.now()/1000 > parseInt(order.deadline) && order.status === "Pending" && (
                                    <Grid item xs={12}>
                                        <Button size="medium" variant="contained" onClick={handleCancle} fullWidth>
                                            Cancle Escrow
                                        </Button>
                                    </Grid>
                                )}
                                {account === order.sellerAddress && Date.now()/1000 < parseInt(order.deadline) && (
                                    <Grid item xs={12}>
                                        <Alert severity="warning">You can cancel the escrow order after the deadline ends.</Alert>
                                    </Grid>
                                )}
                                {account === order.buyerAddress && Date.now()/1000 < parseInt(order.deadline) && order.status === "Pending" && (
                                    <React.Fragment>
                                        <Grid item xs={6}>
                                            <Button size="medium" variant="contained" onClick={handleReject} fullWidth>
                                                Reject Escrow
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button size="medium" variant="contained" onClick={handlePay} fullWidth>
                                                Pay Escrow
                                            </Button>
                                        </Grid>
                                    </React.Fragment>
                                )}
                                {account === order.buyerAddress && Date.now()/1000 > parseInt(order.deadline) && (
                                    <Grid item xs={12}>
                                        <Alert severity="warning">The Escrow Order has expired</Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button href="/info" size="medium" variant="contained" color="secondary" fullWidth>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </React.Fragment>
            )}
        </Box>
    )
}

export default Tx;