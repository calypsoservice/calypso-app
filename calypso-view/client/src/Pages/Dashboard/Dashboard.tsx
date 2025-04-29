import React, { useContext, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardStatisticBlock2, GridColsTwoOneFour } from "../../Components/DashboardBlock"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { Tooltip } from "@mui/material"
import { AppContext } from "../../Contexts/AppContext"



export const Dashboard = () => {
    const { appContext } = useContext(AppContext)

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const [tooltipTitle, setTooltipTitle] = useState<string>("Copy")

    const openTooltip = () => {
        navigator.clipboard.writeText("https://" + window.location.host + "/signup?ref=" + sessionStorage.getItem("username"))
        setTooltipTitle("Copied")
        setTooltipOpen(true)
        setTimeout(() => { setTooltipOpen(false) }, 1500)
    }

    return (
        <React.Fragment>
            <Layout>
                {/* <div className="dashboard">Dashboard</div> */}
                <DashboardContainer title="Dashboard">
                    {/* <GridColsTwoOne className="mb-5">
                        <DashboardStatisticBlock data={{ title: "Total Earn", value: 123.12, symbol: "$" }} />
                        <DashboardStatisticBlock data={{ title: "Total Invest", value: 123.12, symbol: "$" }} />
                        <DashboardStatisticBlock data={{ title: "Total Payout", value: 123.12, symbol: "$" }} />
                        <DashboardStatisticBlock data={{ title: "Total Referral Bonus", value: 123.12, symbol: "$" }} />
                    </GridColsTwoOne> */}
                    <div className="referral-subtitle">Statistic</div>
                    <GridColsTwoOneFour className="mb-5">
                        <DashboardStatisticBlock2 data={{ title: "Total Earn", value: appContext?.user?.totalReward == null ? 0 : Number(appContext?.user?.totalReward).toFixed(2), symbol: "$", icon: "ri-line-chart-line" }} />
                        <DashboardStatisticBlock2 data={{ title: "Total Invest", value: appContext?.user?.totalStake == null ? 0 : Number(appContext?.user?.totalStake).toFixed(2), symbol: "$", icon: "ri-pie-chart-line" }} />
                        <DashboardStatisticBlock2 data={{ title: "Total Payout", value: appContext?.user?.totalPayout == null ? 0 : Number(appContext?.user?.totalPayout).toFixed(2), symbol: "$", icon: "ri-briefcase-line" }} />
                        <DashboardStatisticBlock2 data={{ title: "Total Referral Bonus", value: appContext?.user?.totalRefReward == null ? 0 : Number(appContext?.user?.totalRefReward).toFixed(2), symbol: "$", icon: "ri-slideshow-line" }} />
                    </GridColsTwoOneFour>
                    <div className="referral-subtitle">Your Balance</div>
                    <div className="row items-center justify-center mb-5">
                        <div className="col-12">
                            <table className="balances-table">
                                <thead>
                                    <tr>
                                        <td data-content="#">
                                            <div>#</div>
                                        </td>
                                        <td data-content="Name">
                                            <div>Name</div>
                                        </td>
                                        <td data-content="Balance">
                                            <div>Balance</div>
                                        </td>
                                        <td data-content="Active Staking">
                                            <div>Active Staking</div>
                                        </td>
                                        <td data-content="Price">
                                            <div>Price</div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appContext?.user?.userWallet?.walletAddresses?.map((w: any) => <DashboardWalletTokenElement data={w} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="referral-subtitle">Your Referral Link</div>
                    <div className="row items-center gap-4 md:gap-0">
                        <div className="col-md-8">
                            <div className="referral-link-block" onClick={openTooltip}>
                                <input className="" disabled={true} value={"https://" + window.location.host + "/signup?ref=" + sessionStorage.getItem("username")} />
                                <Tooltip title={tooltipTitle} open={tooltipOpen} placement="top">
                                    <i className="ri-file-copy-fill"></i>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="col-md-4 referral-users">
                            <div className="referral-users-item">
                                <h3>Total Partners</h3>
                                <p>{appContext?.user?.totalChildUser == null ? 0 : appContext?.user?.totalChildUser}</p>
                            </div>
                            <div className="referral-users-item">
                                <h3>Active Partners</h3>
                                <p>{appContext?.user?.totalActiveChildUser == null ? 0 : appContext?.user?.totalActiveChildUser}</p>
                            </div>
                        </div>
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}


const DashboardWalletTokenElement = ({ data }: any) => {
    return (
        <tr>
            <td data-content="#">
                <div className="td-text">
                    <div className="cab-table-num">1</div>
                </div>
            </td>
            <td data-content="Name">
                <div className="td-text">
                    <div className="cab-table-val">
                        <div className="cab-table-cur">
                            <img src={data.token.image} alt="" />
                        </div>
                        <h3 className="cname" data-text={data.token.image}>
                        {data.token.name}{data.token.smartContract != "" ? ` (${data.token.network.symbol})` : ''}&nbsp;
                            <span className="ccur">{data.token.symbol}</span>
                        </h3>
                    </div>
                </div>
            </td>
            <td data-content="Balance">
                <div className="td-text">
                    <div className="cab-table-val">
                        <h3 className="cname" data-text={data.balance === null ? Number(0).toFixed(7) :  Number(data.balance).toFixed(7)}>{data.balance === null ? Number(0).toFixed(7) : Number(data.balance).toFixed(7)}</h3>
                    </div>
                </div>
            </td>
            <td data-content="Active Staking">
                <div className="td-text">
                    <div className="cab-table-val">
                        <h3 className="green" data-text="$0.00">$0.00</h3>
                    </div>
                </div>
            </td>
            <td data-content="Price">
                <div className="td-text">
                    <div className="cab-table-val flex-wrap">
                        <h3 className="green" data-text={"$" + data.token.price === null ? Number(0).toFixed(2) : Number(data.token.price).toFixed(2)}>${data.token.price === null ? Number(0).toFixed(2) : Number(data.token.price).toFixed(2)}</h3>
                        <div className={`cab-table-val2${Number(data.token.percentChange) <= 0 ? " red" : ""}`}>
                            {Number(data.token.percentChange) <= 0 ? <i className="ri-arrow-right-down-line" /> : <i className="ri-arrow-right-up-line" />}
                            {data.token.percentChange}%
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    )
}