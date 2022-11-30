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

interface EscrowOrder {
    escrowId: string;
    tokenId: string;
    paymentAmount: string;
    deadline: Dayjs;
    nftAddress: string;
    buyerAddress: string;
    sellerAddress: string;
    status: string;
}

interface FormState {
    search: boolean;
    form: boolean;
    loading: boolean;
}

interface StateSnackbar {
    open: boolean;
    type: AlertColor;
    message: string;
}

const Info: FC<any> = (): ReactElement => {

    const [ formStatus, setFormStatus ] = React.useState<FormState>({
        search: true,
        form: false,
        loading: false
    });

    const [ alert, setAlert] = React.useState<StateSnackbar>({
        open: false,
        type: "success",
        message:""
    });

    const [ order, setOrder ] = React.useState<EscrowOrder>({
        escrowId:"",
        tokenId:"",
        paymentAmount:"",
        deadline: dayjs(),
        nftAddress: "",
        buyerAddress:"",
        sellerAddress:"",
        status:""
    })
    const orderData = useOrderData(order.escrowId);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder({
            ...order, escrowId: event.target.value
        });
    }

    const handleButtonSearch = () => {
        if(order.escrowId === "") {
            setAlert({
                ...alert,
                open:true,
                type:"warning",
                message:"Escrow ID cannot be empty"
            });
        }else {
            setAlert({
                ...alert,
                open:false
            });
            if(order.nftAddress === "0x0000000000000000000000000000000000000000") {
                console.log(order)
            }else {
                console.log(order);
            }
        }
    }

    React.useEffect(() => {
        if(orderData !== undefined) {
            let status = "";
            if(orderData?.[6] === 0) {
                status = "Pending";
            } else if(orderData?.[6] === 1) {
                status = "Accepted";
            } else if(orderData?.[6] === 2) {
                status = "Rejected";
            }else {
                status = "Canceled";
            }
            setOrder({
                ...order,
                status: status
            });
        }
    }, [orderData]);

    return (
        <Box sx={{mt: 5, display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Snackbar open={alert.open} autoHideDuration={3000}>
                <Alert severity={alert.type}>{alert.message}</Alert>
            </Snackbar>
            <Typography component="h1" variant="h5">
                Escrow Info
            </Typography>
            { formStatus.search && !formStatus.form && (
                <React.Fragment>
                    <Box sx={{ mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField onChange={handleInput} name="escrowId" fullWidth id="escrowId" label="Escrow Id" size="medium"/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleButtonSearch} size="large" fullWidth variant="contained">
                                    Check Escrow Order
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    )
}
export default Info;