import React, { useEffect, useState } from "react";

import { collection, getDocs } from 'firebase/firestore';
import { fireStore } from '@core/firebase';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import Card from "@components/Card";
import BillDetail from "./BillDetail";

import IconPLus from '@icons/iconPlus.svg?react';
import IconDownload from "@icons/iconDownload.svg?react";

const Bill = () => {

    const [state, setState] = useState({
        bills: [],
        products: [],
        pageActive: 0,
        type: 'view',
        billDetail: {},
    });

    useEffect(() => {
        const billDocRef = collection(fireStore, 'bill');
        const productDocRef = collection(fireStore, 'product');

        getDocs(billDocRef).then((querySnapshot) => {
            let bills = [];
            querySnapshot.forEach((doc) => {
                if (doc.data()) bills.push(doc.data());
            });

            let sorted = bills.sort((a, b) => {
                const timeA = new Date(a.time);
                const timeB = new Date(b.time);
                return timeB - timeA;
            });
            setState(prev => ({...prev, bills: bills}));
        });


        getDocs(productDocRef).then((querySnapshot) => {
            let products = [];
            querySnapshot.forEach((doc) => {
                if (doc.data()) products.push(doc.data());
            });
            let filterProducts = products.map(item => {
                return { value: item._id, label: item.name, unit_price: item.unit_price, name: item.name };
            });

            setState(prev => ({...prev, products: filterProducts}));
        });
    },[]);

    const handleBillDetail = (type, billId) => {
        if (type === 'new') {
            setState(prev => ({...prev, pageActive: 1, type: 'new'}));
            return;
        };

        const bill = state.bills.find(item => item._id === billId);

        setState(prev => ({...prev, pageActive: 1, type: 'edit', billDetail: bill}));
    };

    const handleDownload = () => {
        const node = document.getElementById('table-download');

        htmlToImage.toPng(node)
            .then(function(dataUrl) {
                download(dataUrl, 'bao_gia.png');
            })
            .catch(function (error) {
                console.error('Something went wrong!', error);
            });
    };

    const renderPage = () => {
        switch(state.pageActive) {
            case 0:
                return (
                    <div className="flex flex-col gap-4">
                        {state.bills.map((item, index) => {
                            return (
                                <div key={`bill-${index}`}>
                                    <Card
                                        data={item}
                                        handleBillDetail={handleBillDetail}
                                    />
                                </div>
                            )
                        })}
                    </div>
                );
            case 1:
                return <BillDetail products={state.products} type={state.type} bills={state.bills} billDetail={state.billDetail}/>;
        }
    };

    return (
        <div className="w-full h-full px-16 py-10 sm:px-28 relative">
            <div className="absolute top-2 right-16 sm:right-28">
                {state.pageActive === 0 ? (
                    <IconPLus className="cursor-pointer" onClick={() => handleBillDetail('new')}/>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* <IconCopy className="cursor-pointer"/> */}
                        <IconDownload
                            className="cursor-pointer"
                            onClick={handleDownload}
                        />
                    </div>
                )}
            </div>
            <div className="w-full h-full">{renderPage()}</div>
        </div>
    );
};

export default Bill;