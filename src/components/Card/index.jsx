import React from "react";

const Card = (props) => {

    const { data, handleBillDetail } = props;

    return (
        <div
            className="w-full h-32 sm:h-28 bg-white rounded-md border border-[rgb(219,219,219)] hover:border-blue-400 
            transition-colors duration-200 py-3 px-3 sm:px-10 cursor-pointer flex flex-col sm:flex-row sm:items-center 
            sm:justify-between gap-3"
            onClick={() => handleBillDetail('edit', data?._id)}
        >
            <div className="flex flex-col gap-1">
                <div className="text-xl font-bold text-blue-400">{data?.title}</div>
                <div className="text-sm italic">{data?.note}</div>
            </div>   
            <div className="">
                <div className="text-sm">{data?.time}</div>
            </div>   
        </div>
    );
};

export default Card;