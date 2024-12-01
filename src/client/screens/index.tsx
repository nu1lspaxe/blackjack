import { createMemoryRouter, RouteObject } from 'react-router-dom';

import MainScreen from './main-screen';
import MainMenu from './main-menu';
import RandomMatch from './random-match';
import RoomJoin from './room-join';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainScreen />
    },
    {
        path: '/menu',
        element: <MainMenu />
    },
    {
        path: '/match',
        element: <RandomMatch  />
    },
    {
        path: '/join',
        element: <RoomJoin />
    },
    {
        path: '/waiting',
        element: <></>
    },
    // {
    //     path: '/lobby',
    //     element: <></>
    // }
];

export const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
    }
});

export default router;