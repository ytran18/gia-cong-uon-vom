import React from "react";

import Header from "@components/Header";

const DefaultLayout = ({ children }) => {
    return (
        <div className="w-screen h-screen">
            <div className="w-full h-[70px] border-b border-[rgb(219,219,219)]">
                <Header />
            </div>
            <div className="">
                {children}
            </div>
        </div>
    );
};

export default DefaultLayout;