import React, { ReactElement, FC } from "react";
import {
    Box,
    Typography,
    Grid,
    Link,
    TextField,
    Button,
    Skeleton,
    AlertColor,
    Alert,
    Snackbar,
} from "@mui/material";
import { useOrderData } from "../utils/escrow";
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

const Info: FC<any> = (): ReactElement => {
    const [formSearch, setFormSearch] = React.useState(true);
    const [formData, setFormData] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef<number>();

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
    })

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder({ ...order, escrowId: event.target.value });
    }
    const escrowOrder = useOrderData(order.escrowId);

    const handleButtonSearch = () => {
        if (escrowOrder === "Error" || escrowOrder === undefined) {
            console.log("Error")
        } else if (escrowOrder === "Null") {
            console.log("Not found");
        } else {
            let status = "";
            if (escrowOrder?.[6] === 0) {
                status = "Pending";
            } else if (escrowOrder?.[6] === 1) {
                status = "Accepted";
            } else if (escrowOrder?.[6] === 2) {
                status = "Rejected";
            } else if (escrowOrder?.[6] === 3) {
                status = "Canceled";
            }
            setOrder({
                ...order,
                tokenId: escrowOrder?.[0].toString(),
                paymentAmount: escrowOrder?.[1].toString(),
                deadline: escrowOrder?.[2].toString(),
                deadlineObject: dayjs.unix(escrowOrder?.[2].toNumber()),
                nftAddress: escrowOrder?.[3],
                buyerAddress: escrowOrder?.[4],
                sellerAddress: escrowOrder?.[5],
                status: status
            });
            console.log(order);
            setFormSearch(false);
            setFormData(true);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setLoading(false);
            }, 10000)
        }
    }

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        }
    }, [])

    return (
        <Box sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Typography component="h1" variant="h5">Escrow Info</Typography>
            {formSearch && !formData && (
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
                                    onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    fullWidth
                                    onClick={handleButtonSearch}>Check Escrow</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>
            )}
            {!formSearch && formData && (
                <React.Fragment>
                    <Box sx={{ mt: 3 }}>
                        {loading ? (
                            <Grid container spacing={3}>
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
                                            setOrder({...order,deadlineObject:test})
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params}
                                            fullWidth/>
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
                                        name="nftAddress"
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
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Status"
                                        name="status"
                                        id="status"
                                        size="medium"
                                        value={order.status}
                                        fullWidth
                                        InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button size="medium" variant="contained" fullWidth>
                                        Cancle Escrow
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button href="/info" size="medium" variant="contained" color="secondary" fullWidth>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                        {formData && !loading && (
                            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Link href="/info" variant="body2">Already have an escrow id? Check status</Link>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </React.Fragment>
            )}
        </Box>
    )
}

export default Info;