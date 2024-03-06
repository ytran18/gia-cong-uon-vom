import * as Page from './pages';

const AppRoutes = [
    {
        path: '/bao-gia',
        Component: Page?.BillPage,
    },
    {
        path: '/san-pham',
        Component: Page?.ProductPage,
    }
];

export default AppRoutes;