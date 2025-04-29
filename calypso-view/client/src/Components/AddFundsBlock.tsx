import React, { FC, PropsWithChildren } from "react";
import USDT from '../assets/images/svg/crypto-icons/usdt.svg'
import { ITokenContext } from "../Types";


export const AddFundsBlock: FC<PropsWithChildren<{ data: any, className?: string, selected: boolean, setSelectedToken: React.Dispatch<React.SetStateAction<number>> }>> = ({ data, className, selected, setSelectedToken }) => {
    return (
        <div className={`addfunds-block ${className ? className : ''}`}>
            <div className="addfunds-block-title-wrapper">
                <div className="addfunds-block-title-image">
                    <img src={USDT} alt={data.symbol} className="" />
                </div>
                <div className="addfunds-block-title">{data.symbol} {data.networkName}</div>
            </div>
            <div className="addfunds-block-button-wrapper">
                <button className={`addfunds-block-button${selected ? " selected" : ''}`} disabled={selected} onClick={() => setSelectedToken(data.id)}>{ selected ? "Selected" : "Select"}</button>
            </div>
        </div>
    )
}


export const AddFundsBlockSecond: FC<PropsWithChildren<{ data: ITokenContext, className?: string, selected: boolean, setSelectedToken: any }>> = ({ data, className, selected, setSelectedToken }) => {
    return (
        <div className={`addfunds-block${selected ? ' active' : ''}${className ? ' ' + className : ''}`} onClick={() => setSelectedToken(data)}>
            <div className="addfunds-block-title-wrapper">
                <div className="addfunds-block-title-image">
                    <img src={data.image} alt={data.symbol} className="" />
                    <div>{data.symbol}</div>
                </div>
                <div className="addfunds-block-title">{data.network.name} ({data.network.symbol})</div>
            </div>
        </div>
    )
}