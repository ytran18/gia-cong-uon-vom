import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import logo from '@images/td-window-logo.png';

import './style.css';

const Header = (props) => {

    const {} = props;
    const navigate = useNavigate();

    const [state, setState] = useState({
        activeTab: 0,
    });

    const tabs = [
        {
            name: 'BÁO GIÁ',
            path: '/bao-gia',
            tab: 0,
        },
        {
            name: 'SẢN PHẨM',
            path: '/san-pham',
            tab: 1,
        }
    ];

    const handleChangeTab = (tab) => {
        state.activeTab = tab;
        setState(prev => ({...prev}));

        const path = {
            0: '/bao-gia',
            1: '/san-pham',
        }[tab] || '/bao-gia';

        navigate(path);
    };

    return (
        <div className="w-full h-full header flex justify-between px-16 sm:px-28 items-center">
            <img src={logo} alt="logo" className="max-h-full p-2"/>

            <div className="flex items-center gap-4">
                {tabs.map((item, index) => {
                    return (
                        <div key={`header-tab-${index}`}>
                            <div
                                className={`font-semibold text-sm cursor-pointer hover:text-[#E95A5E] transition-colors duration-200 ${state.activeTab === item.tab? 'active-tab': ''}`}
                                onClick={() => handleChangeTab(item.tab)}
                            >
                                {item.name}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="hidden sm:flex"></div>
        </div>
    );
};

export default Header;