import React, { useContext, useEffect, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { IWalletTransaction } from "../../Types"
import { toLocalTime } from "../../Hooks/helpers"
import { AppContext } from "../../Contexts/AppContext"
import { useNavigate } from "react-router-dom"




export const History = () => {
    
    const { appContext } = useContext(AppContext)
    const [txList, setTxList] = useState<IWalletTransaction[]>()

    useEffect(() => {
        setTxList(appContext.user?.walletTransactions.sort(function(a,b) { return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime() }))
    }, [appContext])

    useEffect(() => {
        setTxList(appContext.user?.walletTransactions.sort(function(a,b) { return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime() }))
    }, [])

    return (
        <React.Fragment>
            <Layout>
                <div className="history-container">
                    {/* <div className="history-filter">
                        <button className="active history-filter-item">All Transaction</button>
                        <button className="history-filter-item">Deposit</button>
                        <button className="history-filter-item">Withdrawal</button>
                        <button className="history-filter-item">Ref. Commision</button>
                        <button className="history-filter-item">Payment</button>
                    </div> */}
                    <div className="history-table">
                        <div className="block-title mb-3">Transaction History</div>
                        <div className="history-table-wrapper">
                            <table className="responsive">
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="history-text"></div>
                                        </td>
                                        <td>
                                            <div className="history-text">
                                                <div className="history-thead-title">Transaction Type</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="history-text">
                                                <div className="history-thead-title">Amount</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="history-text">
                                                <div className="history-thead-title">Status</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="history-text">
                                                <div className="history-thead-title">Date</div>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {txList?.map(wt => wt.hidden ? null : <HistoryRow data={wt} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

const HistoryRow = ({ data }: { data: IWalletTransaction }) => {
    const [date] = useState<string>(toLocalTime(data.dateCreated).toLocaleString())

    const navigate = useNavigate()

    return (
        <tr>
            <td className="cursor-pointer" onClick={() => navigate(`${data.type.type == 'withdraw' ? `/cashout/transaction/${data.hash}` : `/transaction/${data.hash}`}`)} >
                <div className="history-text">
                    <div className="history-table-icon">
                        <i className="ri-message-3-line" />
                    </div>
                </div>
            </td>
            <td data-title="Transaction Type">
                <div className="history-text">
                    <div className="history-table-type">
                        {data.type.type == 'withdraw' ? 'Withdraw' : data.type.type == 'receive' ? "Add funds" : data.type.type == 'stake' ? "Deposit" : data.type.type == 'unstake' ? "Close deposit" : data.type.type == "refBonus" ? "Referral bonus" : data.type.type == 'bonus' ? "Bonus" : ""}
                    </div>
                </div>
            </td>
            <td data-title="Amount">
                <div className="history-text">
                    <div className="history-table-value">
                        <h4>{data.amount}&nbsp;{data.walletAddress.token.symbol}</h4>
                    </div>
                </div>
            </td>
            <td data-title="Status">
                <div className="history-text">
                    <div className={`history-table-status${data.status.status.toLowerCase() == 'prepared' ? ' prepared' : data.status.status.toLowerCase() == 'confirmation' ? " confirmation" : data.status.status.toLowerCase() == 'error' ? " error" : ''}`}>
                        {data.status.status}
                    </div>
                </div>
            </td>
            <td data-title="Date">
                <div className="history-text">
                    <div className="history-table-value">
                        <h4>{date}</h4>
                    </div>
                </div>
            </td>
        </tr>
    )
}