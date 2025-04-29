import React, { FC, PropsWithChildren, useContext, useEffect, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../Contexts/AppContext"
import { IUserStakeContext } from "../../Types"




export const Deposites = () => {

    const [activeDeposits, setActiveDeposits] = useState<IUserStakeContext[]>([])
    const [closedDeposits, setClosedDeposits] = useState<IUserStakeContext[]>([])

    const navigate = useNavigate()

    const { appContext } = useContext(AppContext)

    useEffect(() => {
        if (appContext.user?.userStakes) {
            var active: IUserStakeContext[] = []
            var closed: IUserStakeContext[] = []
            appContext.user?.userStakes.reverse().forEach(st => {
                if (st.closed) {
                    closed.push(st)
                }
                else {
                    active.push(st)
                }
            })
            setActiveDeposits(active)
            setClosedDeposits(closed)
        }
    }, [appContext.user?.userStakes])

    return (
        <React.Fragment>
            <Layout>
                <DepositesContainer>
                    <div className="gap-2 lg:gap-0 row">
                        <div className="col-lg-6">
                            <div className="flex flex-col justify-start items-start border-[#16302d] p-6.5 border border-solid rounded-2.5xl w-full h-full">
                                <div className="mb-7.5 font-bold text-sm text-white">Active Deposits</div>
                                {activeDeposits && activeDeposits.length > 0 ?
                                    activeDeposits.map(ad => <DepositeInfoBlock data={ad} />)
                                    :
                                    <a className="inline-flex flex-row justify-center items-center mt-2.5 w-full font-bold text-center text-sm cursor-pointer open-deposite-btn" onClick={() => navigate('/deposit/')}>
                                        Open Deposit
                                    </a>
                                }
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="flex flex-col justify-start items-start border-[#16302d] p-6.5 border border-solid rounded-2.5xl w-full h-full">
                                <div className="mb-7.5 font-bold text-sm text-white">Closed Deposits</div>
                                {closedDeposits && closedDeposits.length > 0 ?
                                    closedDeposits.map(cd => {
                                            return <DepositeInfoBlock data={cd} />
                                    })
                                    :
                                    <a className="inline-flex flex-row justify-center items-center mt-2.5 w-full font-bold text-center text-sm cursor-pointer open-deposite-btn" onClick={() => navigate('/deposit/')}>
                                        Open Deposit
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                </DepositesContainer>
            </Layout>
        </React.Fragment>
    )
}

export function addDaysDstFail(date: Date, days: number) {
    var dayms = (days * 24 * 60 * 60 * 1000);
    return new Date(date.getTime() + dayms);    
}

export function leftPercentOfPeriod(dateStart: Date, periodDays: number) {
    return (((new Date().getTime() - dateStart.getTime()) / 24 / 60 / 60 / 1000) * 100) / periodDays
}

export const DepositeInfoBlock: FC<{ data: IUserStakeContext }> = ({ data }) => {

    const [stakeDate] = useState<Date>(new Date(data.dateCreated))
    const [endStakeDate] = useState<Date>(addDaysDstFail(new Date(data.dateCreated), data.stake.periodDays))
    const [completePercent] = useState<number>(data.closed == false ? leftPercentOfPeriod(new Date(data.dateCreated), data.stake.periodDays) : 100)

    return (
        <div className={`w-full rounded-md relative p-4 mb-0 bg-[#ffffff] deposite-info-section${data.closed ? ' closed' : ''}`}>
            <div className="row">
                <div className="col-sm-7">
                    <div className="flex flex-col justify-start items-start mb-4 w-full">
                        <h3 className="mb-2 font-bold text-black text-sm">{data.stake.name}</h3>
                        <p className="font-normal text-black text-xs">
                            <span className="font-extrabold text-[#037867] text-sm deposite-info-percent">{data.stake.percentDay}%</span>
                            &nbsp;
                            per working day
                        </p>
                    </div>
                    <div className="inline-flex flex-row justify-start items-start bg-[#1b1e1f] mb-7.5 p-2 rounded-lg">
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="font-semibold text-sm text-white">{`${stakeDate.getDate()}.${stakeDate.getMonth()+1}.${stakeDate.getFullYear()}`}</h3>
                            <p className="font-normal text-[#B4B3AF] text-xs">Date</p>
                        </div>
                        <i className="ri-arrow-right-line mx-2 mt-0.5 text-[#B4B3AF] text-xs" />
                        <div className="flex flex-col justify-start items-start">
                            <h3 className="font-semibold text-sm text-white">{`${endStakeDate.getDate()}.${endStakeDate.getMonth()+1}.${endStakeDate.getFullYear()}`}</h3>
                            <p className="font-normal text-[#B4B3AF] text-xs">End Date</p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-5">
                    <div className="text-right flex flex-col justify-start items-end mb-5.5">
                        <img src={data.token.image} alt="" className="mb-7 w-9" />
                        <div>
                            <h3 className="font-extrabold text-black text-sm">{data.amount}&nbsp;{data.token.symbol}</h3>
                            <p className="font-normal text-black text-xs">Amount</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
                <h3 className="flex gap-1 font-normal text-black text-xs">
                    <i className="ri-numbers-line" />
                    Progress
                </h3>
                <p className="font-bold text-[#037867] text-xs deposite-info-percent">{completePercent < 100 ? completePercent.toFixed(2) : 100}%</p>
            </div>
            <div className="deposite-info-bottom-line left-[50%] absolute">
                <span style={{ width: `${completePercent < 100 ? completePercent.toFixed(2) : 100}%` }}></span>
            </div>
        </div>
    )
}

export const DepositesContainer: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-col gap-2 mb-4 p-4">
            {children}
        </div>
    )
} 