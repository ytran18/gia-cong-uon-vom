import * as Page from './pages';

const AppRoutes = [
    {
        path: '/bao-gia',
        Component: Page?.BillPage,
        defaultLayout: true
    },
    {
        path: '/san-pham',
        Component: Page?.ProductPage,
        defaultLayout: true
    }
];

export default AppRoutes;