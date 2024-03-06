import React, { Fragment, useEffect } from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from "./routes.js";

import DefaultLayout from "@components/DefaultLayout/index.jsx";

const App = () => {

    useEffect(() => {
        if (window.location.pathname === "/") {
            window.location.pathname = "/bao-gia";
        }
    },[]);

    return (
        <BrowserRouter>
            <Routes>
                {
                    AppRoutes.map((item, index) => {
                        const Layout = item.defaultLayout ? DefaultLayout : Fragment;
                        const Page = item.Component;
                        return (
                            <Route 
                                key={index}
                                path={item.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        )
                    })
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
