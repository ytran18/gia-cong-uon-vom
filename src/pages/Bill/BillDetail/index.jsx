import React, { useRef, useEffect, useState, useMemo } from "react";

import { doc, collection, setDoc, updateDoc } from 'firebase/firestore';
import { fireStore } from '@core/firebase';

import { Select, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import CurrencyInput from 'react-currency-input-field';

import logo from "@images/td-window-logo.png"
import IconRemove from "@icons/iconRemove.svg?react";

const Context = React.createContext({
    name: 'Default',
});

const BillDetail = (props) => {

    const {products, type, billDetail} = props;

    const [state, setState] = useState({
        numberOfProducts: [],
        so_m_uon: 0,
        so_bo_gia_cong: 0,
        don_gia_uon: 0,
        don_gia_gia_cong: 0,
        don_gia_uon: 0,
    });

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement, message, type) => {
        api[type]({
            message: `${message}`,
            placement,
        });
    };

    const contextValue = useMemo(() => ({
        name: 'Ant Design',
    }),[]);

    const titleRef = useRef(null);
    const noteRef = useRef(null);

    useEffect(() => {
        if (type === 'edit' && billDetail) {
            titleRef.current.value = billDetail?.title;
            noteRef.current.value = billDetail?.note;

            if (billDetail?.material) {
                const numberOfProducts = billDetail?.material.map(item => {
                    const uuid = uuidv4();
                    const unit_price = products.find(product => product.value === item.id)?.unit_price;
                    const name = products.find(product => product.value === item.id)?.name;

                    return {
                        uuid: uuid,
                        id: item.id,
                        amount: item.amount,
                        unit_price: unit_price,
                        price: unit_price * item.amount,
                        name: name,
                    }
                });
                numberOfProducts.push({uuid: uuidv4(), id: '', amount: 0, unit_price: '', price: 0, name: ''});
                state.numberOfProducts = numberOfProducts;
            };
            state.so_m_uon = billDetail?.so_m_uon;
            state.so_bo_gia_cong = billDetail?.so_bo_gia_cong;
            state.don_gia_uon = billDetail?.don_gia_uon;
            state.don_gia_gia_cong = billDetail?.don_gia_gia_cong;
            setState(prev => ({...prev}));
        };
    },[billDetail]);

    useEffect(() => {
        if (titleRef.current) titleRef.current.focus();
        
        if (type === 'new') {
            const uuid = uuidv4();
            setState(prev => ({...prev, numberOfProducts: [{uuid: uuid, id: '', amount: 0, unit_price: '', price: 0, name: ''}] }));
        };
    },[]);

    const handleOnChangeAmount = (uuid, e) => {
        const products = state.numberOfProducts.map(item => {
            if (item.uuid === uuid) return {...item, amount: e.target.value, price: e.target.value * item.unit_price};
            else return item;
        });

        setState(prev => ({...prev, numberOfProducts: products}));
    };

    const handleCancel = () => {
        openNotification('topRight')
    };

    const onSelect = (id, product, uuid) => {
        const newLineUuid = uuidv4();
        let products = state.numberOfProducts.map(item => {
            if (item.uuid === uuid) return {...item, id: id, unit_price: product.unit_price, name: product.name};
            else return item;
        });

        if (products[products.length - 1].id !== '') {
            products.push({id: '', amount: 0, unit_price: '', uuid: newLineUuid, price: 0, name: ''});
        };

        setState(prev => ({...prev, numberOfProducts: products}));
    };

    const formatCurrencyVN = (number) => {
        if (isNaN(number)) return "";
      
        let numberStr = number.toString();
        let [wholeNumber, decimal] = numberStr.split(",");
      
        wholeNumber = wholeNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        let formattedNumber = `${wholeNumber}`;
      
        return `${formattedNumber}₫`;
    };

    const handleRemoveProduct = (uuid) => {
        if (uuid) {
            const products = state.numberOfProducts.filter(item => item.uuid !== uuid);
            setState(prev => ({...prev, numberOfProducts: products}));
        };
    };

    const handleSave = async () => {
        const products = state.numberOfProducts;
        const title = titleRef.current.value;

        if (!title) {
            openNotification('topRight', 'Chưa nhập tiêu đề', 'error');
            return;
        };

        let saveProducts = [];
        if (products.length > 1 && products[products.length - 1].id === '') {
            saveProducts = products.splice(0, products.length - 1);
        };

        if (saveProducts.length === 0) {
            openNotification('topRight', 'Hãy nhập sản phẩm', 'error');
            return;
        };

        const material = saveProducts.map(item => {
            return {
                id: item.id,
                amount: item.amount,
            };
        });
        
        const id = type === 'new' ? uuidv4() : billDetail._id;

        const record = {
            _id: id,
            title: title,
            note: noteRef.current.value,
            material: material,
            don_gia_uon: state.don_gia_uon,
            don_gia_gia_cong: state.don_gia_gia_cong,
            so_m_uon: state.so_m_uon,
            so_bo_gia_cong: state.so_bo_gia_cong,
            time: new Date().toLocaleString()
        };

        if (type === 'new') {
            const docRef = doc(collection(fireStore, 'bill'), id);
            await setDoc(docRef, record);
        } else {
            console.log(billDetail);
            const docRef = doc(fireStore, 'bill', billDetail._id);
            await updateDoc(docRef, record);
        }

        window.location.reload();
    };

    const productTitle = ['Nhôm', 'Số lượng', 'Đơn giá', 'Thành tiền'];
    
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}
            <div className="flex w-full h-full flex-col gap-5">
                <div className="w-full h-10">
                    <input
                        ref={titleRef}
                        className="w-full h-full outline-none border border-[rgb(219,219,219)] rounded-md p-2 text-sm"
                        placeholder="Nhập tiêu đề..."
                    />
                </div>
                <div className="flex-grow rounded-md">
                    <table id="table-download" style={{backgroundColor: 'white'}} className="border-collapse w-full h-full">
                        <tbody>
                            <tr className="w-full">
                                <td colSpan={3} className="border">
                                    <div className="flex items-center justify-center">
                                        <img src={logo} className=" w-12"/>
                                    </div>
                                </td>
                                <td colSpan={7} className="border">
                                    <div className="flex flex-col text-sm py-2 font-semibold items-center justify-center">
                                        <div className="">{`TD Window`}</div>
                                        <div className="">{`Gia công uốn vòm cửa nhôm xingfa`}</div>
                                        <div className="">{`http://giaconguomvom.com`}</div>
                                        <div className="">{`0908-401-700 ( Phone / Zalo )`}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={3} className="text-sm h-11 min-h-11 text-center border">Bản vẽ</td>
                                <td colSpan={7} className="border px-3 h-11 min-h-11">
                                    <input
                                        ref={noteRef}
                                        className="w-full h-full outline-none text-sm"
                                        placeholder="Ghi chú ..."
                                    />
                                </td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={3} rowSpan={state.numberOfProducts.length + 7} className="border"></td>
                                {productTitle.map((item, index) => (
                                    <td colSpan={1} className="border min-h-11 h-11 text-sm font-semibold text-center" key={`product-title-${index}`}>{item}</td>
                                ))}
                            </tr>
                            {state.numberOfProducts.map((item, index) => {
                                return (
                                    <tr className="w-full" key={`product-${index}`}>
                                        <td colSpan={1} className="border w-[370px] relative min-w-[370px] text-sm text-center py-3 px-8">
                                            <Select
                                                className="w-full border-none outline-none"
                                                showSearch
                                                value={item?.id}
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => handleFilter(input, option)}
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                onSelect={(id, product) => onSelect(id, product, item.uuid)}
                                                options={products}
                                            />
                                            {item.id !== '' && (
                                                <div className="absolute top-1 right-1">
                                                    <IconRemove
                                                        className="cursor-pointer"
                                                        onClick={() => handleRemoveProduct(item.uuid)}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td colSpan={1} className="border w-32 max-w-32 text-sm text-center px-2">
                                            <input
                                                className="w-full outline-none text-center"
                                                type="number"
                                                min={0}
                                                value={item?.amount}
                                                onChange={(e) => handleOnChangeAmount(item.uuid, e)}
                                            />
                                        </td>
                                        <td colSpan={1} className="border text-sm text-center">{formatCurrencyVN(item?.unit_price) || ''}</td>
                                        <td colSpan={1} className="border text-sm text-center">{formatCurrencyVN(item?.amount * Number(item?.unit_price))}</td>
                                    </tr>
                                )}
                            )}
                            <tr className="w-full">
                                <td colSpan={3} className="border h-11 min-h-11 text-sm text-center">Tổng cộng nhôm: </td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center">{formatCurrencyVN(state.numberOfProducts.reduce((a, b) => a + b.price, 0))}</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={1} rowSpan={2} className="border text-sm text-center font-semibold">Gia công uốn</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Số m</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Đơn giá</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Thành tiền</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={1} className="border w-32 max-w-32 h-11 min-h-11 text-sm text-center px-2">
                                    <input
                                        className="w-full outline-none text-center"
                                        type="number"
                                        min={0}
                                        step={0.2}
                                        value={state.so_m_uon}
                                        onChange={(e) => setState(prev => ({...prev, so_m_uon: e.target.value}))}
                                    />
                                </td>
                                <td colSpan={1} className="border w-32 max-w-32 h-11 min-h-11 text-sm text-center px-2">
                                    <CurrencyInput 
                                        className="w-full outline-none text-center"
                                        decimalsLimit={2}
                                        suffix="₫"
                                        value={state.don_gia_uon}
                                        onValueChange={(e) => setState(prev => ({...prev, don_gia_uon: e}))}
                                    />
                                </td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center">{formatCurrencyVN(state.don_gia_uon * state.so_m_uon)}</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={1} rowSpan={2} className="border text-sm text-center font-semibold">Gia công hoàn thiện</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Số bộ</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Đơn giá</td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center font-semibold">Thành tiền</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={1} className="border w-32 max-w-32 h-11 min-h-11 text-sm text-center px-2">
                                    <input
                                        className="w-full outline-none text-center"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={state.so_bo_gia_cong}
                                        onChange={(e) => setState(prev => ({...prev, so_bo_gia_cong: e.target.value}))}
                                    />
                                </td>
                                <td colSpan={1} className="border w-32 max-w-32 h-11 min-h-11 text-sm text-center px-2">
                                    <CurrencyInput 
                                        className="w-full outline-none text-center"
                                        decimalsLimit={2}
                                        suffix="₫"
                                        value={state.don_gia_gia_cong}
                                        onValueChange={(e) => setState(prev => ({...prev, don_gia_gia_cong: e}))}
                                    />
                                </td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center">{formatCurrencyVN(state.don_gia_gia_cong * state.so_bo_gia_cong)}</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={3} className="border h-11 min-h-11 text-sm text-center">Tổng cộng gia công: </td>
                                <td colSpan={1} className="border h-11 min-h-11 text-sm text-center">{formatCurrencyVN(state.don_gia_uon * state.so_m_uon + state.don_gia_gia_cong * state.so_bo_gia_cong)}</td>
                            </tr>
                            <tr className="w-full">
                                <td colSpan={3} className="text-sm h-11 text-center border font-semibold">Tổng cộng</td>
                                <td colSpan={7} className="border min-h-11 text-md text-center text-red-500 font-semibold">
                                    {formatCurrencyVN((state.don_gia_uon * state.so_m_uon + state.don_gia_gia_cong * state.so_bo_gia_cong) + state.numberOfProducts.reduce((a, b) => a + b.price, 0))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex justify-end gap-3">
                    <div
                        className="text-sm font-semibold px-5 py-2 border rounded-md cursor-pointer hover:border-blue-400 transition-colors duration-200"
                        onClick={handleCancel}
                    >
                        Thoát
                    </div>
                    <div
                        className="text-sm font-semibold bg-blue-400 text-white px-5 py-2 rounded-md cursor-pointer"
                        onClick={handleSave}
                    >
                        Lưu
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
};

export default BillDetail;