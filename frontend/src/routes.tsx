import { FC } from "react";

import Home from "./pages/create";
import Tx from "./pages/info";

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
        title: 'Tx Escrow',
        path: '/info',
        enabled: true,
        component: Tx
    }

]