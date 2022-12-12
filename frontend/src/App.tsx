import React from "react";
import { customTheme } from "./utils/theme";
import { routes as appRoutes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
    Container,
    ThemeProvider,
    AppBar,
    Toolbar,
    Link,
    Button,
    Typography,
} from "@mui/material";
import { useEthers, shortenAddress } from "@usedapp/core";

function App() {
    const { activateBrowserWallet, account, deactivate } = useEthers();
    return (
        <ThemeProvider theme={customTheme}>
            <AppBar position="static">
                <Toolbar sx={{ flexWrap: "wrap" }}>
                    <Typography
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        Escrow NFT
                    </Typography>
                    <nav>
                        <Link
                            variant="subtitle1"
                            color="common.white"
                            href="/"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Create Escrow
                        </Link>
                    </nav>
                    {!account && (
                        <Button
                            variant="contained"
                            onClick={() => activateBrowserWallet()}
                            sx={{
                                backgroundColor: "#A7B5AD",
                                my: 1,
                                mx: 1.5,
                            }}
                        >
                            Connect
                        </Button>
                    )}
                    {account && (
                        <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#A7B5AD",
                            my: 1, mx: 1.5
                        }}
                        onClick={() => deactivate()}
                    >
                        {shortenAddress(account)}
                    </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="sm">
                {/* <CssBaseline /> */}
                <Router>
                    <Routes>
                        {appRoutes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                    </Routes>
                </Router>
            </Container>
        </ThemeProvider>
    );
}

export default App;
