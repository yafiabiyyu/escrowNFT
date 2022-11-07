import { FC } from "react";

import Home from "./pages/create";
import Info from "./pages/info";
import Pay from "./pages/pay";

interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC<{}>
}

export const routes: Array<Route> = [
    {
        key: 'home-route',
        title: 'Create Escrow',
        path: '/',
        enabled: true,
        component: Home
    },
    {
        key: 'info-route',
        title: 'Info Escrow',
        path: '/info',
        enabled: true,
        component: Info
    },
    {
        key: 'pay-route',
        title: 'Pay Escrow',
        path: '/pay',
        enabled: true,
        component: Pay
    }

]