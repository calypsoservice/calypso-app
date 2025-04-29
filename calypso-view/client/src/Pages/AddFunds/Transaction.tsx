import React, { useContext, useEffect, useRef, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import QRCodeStyling from "qr-code-styling-node";
import { TransactionBlock } from "../../Components/TransactionBlock";
import { TransactionDetails, TransactionDetailsRow } from "../../Components/TransactionDetails";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Contexts/AppContext";
import { IWalletTransaction } from "../../Types";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../../constants";
import { logoutHandler } from "../../Hooks/helpers";


const qrImg = new QRCodeStyling({
    width: 150,
    height: 150,
    // image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzkiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCAzOSA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDYuNzExMTFMMTkuNDk5OCAwLjVWNDMuNUM1LjU3MTM4IDM3Ljc2NjcgMCAyNi43Nzc4IDAgMjAuNTY2N1Y2LjcxMTExWk0zOSA2LjcxMTExTDE5LjUwMDIgMC41VjQuMDY0MjZMMTkuNDk5OSA0LjA2NDE4VjQwLjAwNzZDMTkuNSA0MC4wMDc2IDE5LjUwMDEgNDAuMDA3NiAxOS41MDAyIDQwLjAwNzVWNDMuNUMzMy40Mjg2IDM3Ljc2NjcgMzkgMjYuNzc3OCAzOSAyMC41NjY3VjYuNzExMTFaTTE5LjUwMDIgNDAuMDA3NUMzMS4xNDI3IDM1LjIxNTEgMzUuNzk5NyAyNi4wMjk2IDM1Ljc5OTcgMjAuODM3OFY5LjI1NjAyTDE5LjUwMDIgNC4wNjQyNlY0MC4wMDc1WiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=",
    dotsOptions: {
        color: "#000000",
        type: "extra-rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
    },
    // backgroundOptions: {
    //     color: "transparent"
    // },
    cornersSquareOptions: {
        type: "extra-rounded"
    }
})

export const ETHHeshRegex = /^0x([A-Fa-f0-9]{64})$/
export const TRXHashRegex = /^([A-Fa-f0-9]{64})$/
export const BTCHashRegex = /^([A-Fa-f0-9]{64})$/
export const TONHashRegex = /^([A-Fa-f0-9]{64})$/
export const HashRegex = /^(0x)?([A-Fa-f0-9]{64})$/

export const Transaction = () => {

    const qrContainerRef = useRef(null);
    const [transaction, setTransaction] = useState<IWalletTransaction>()
    const [hashInput, setHashInput] = useState<string>()
    const [hashFormStatus, setHashFormStatus] = useState<0 | 1 | 2 | 3>(0)
    const [hashFormError, setHashFormError] = useState<string | undefined>()
    const [update, setUpdate] = useState<number>(0)

    const { appContext, setAppContext } = useContext(AppContext)

    const { hash } = useParams()
    const navigate = useNavigate()
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    useEffect(() => {
        if (qrContainerRef?.current) {
            qrImg?.append(qrContainerRef.current);
        }
    }, [qrContainerRef])

    useEffect(() => {
        qrImg?.update({
            data: transaction?.walletAddress?.address ? transaction.walletAddress.address : ''
        });
        if (qrContainerRef?.current) {
            qrImg?.append(qrContainerRef.current);
        }
    }, [transaction]);

    useEffect(() => {
        if (!appContext.user) return
        if (!transaction) return
        if (update == 0) {
            setUpdate(update + 1)
        }
        if (transaction?.receiveHash) {
            setHashFormError(undefined)
            setHashInput(transaction.receiveHash)
            setHashFormStatus(3)
        }
    }, [appContext, transaction])

    useEffect(() => {
        if (!appContext.user) return
        if (!transaction) return
        if (transaction.status.status == "completed" || transaction.status.status == "error") {
            return
        }
        const intervalId = setInterval(() => {
            axios.post(SERVER_URL + '/trans/get', { hash: transaction.hash }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then(r => {
                    console.log(r)
                    setTransaction({ ...transaction, status: { ...transaction.status, status: r.data.status } })
                })
                .catch(e => {
                    console.log(e)
                })
        }, 1000);
        return () => clearInterval(intervalId);
    }, [update])

    useEffect(() => {
        if (appContext.user) {
            appContext.user?.walletTransactions.forEach(tr => {
                if (tr.hash == hash) {
                    setTransaction(tr)
                    if ((hashInput === undefined || hashInput == "") && tr.receiveHash == null) {
                        console.log("hash is blank")
                        setHashFormError("")
                    }
                }
            })

        }
    }, [appContext.user])

    const closeTransaction = () => {
        navigate('/cashin/')
    }

    const hashInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (event.target.value.match(HashRegex) && event.target.value != "") {
            setHashFormError(undefined)
            setHashFormStatus(0)
        }
        else {
            setHashFormError('Invalid hash')
            setHashFormStatus(2)
        }
    }

    const hashInputFocus = () => {
        setHashFormError(undefined)
    }

    const hashInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        var value = event.target.value;
        setHashInput(value)
    }

    const sendHashInput = () => {
        console.log(hashInput)
        if (!transaction) return
        console.log(hashInput)
        setHashFormStatus(1)
        if (hashInput?.match(HashRegex)) {
            axios.post(SERVER_URL + '/trans/update', { hash: transaction.hash, receiveHash: hashInput, hidden: false }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then(async () => {
                    var user: any
                    try {
                        user = await axios.post(SERVER_URL + '/user/get/username', { username: sessionStorage.getItem("username") }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                        user = user.data
                        console.log(user)
                        if (user.blocked == true) {
                            console.log("User blocked")
                            logoutHandler()
                            navigate('/login/blocked/' + `?rid=${location.pathname}`)
                            return
                        }
                        else {
                            setAppContext({ ...appContext, user: user })
                            setHashFormStatus(3)
                            setHashFormError(undefined)
                        }
                    }
                    catch (error) {
                        console.log(error)
                        // if (user.status == 401 || user.request.code == "ERR_NETWORK") {
                        console.log("Invalid Token")
                        logoutHandler()
                        navigate('/login/' + `?rid=${location.pathname}`)
                        // }

                    }
                })
                .catch(() => {
                    setHashFormError('Invalid hash')
                    setHashFormStatus(2)
                })
        }
        else {
            setHashFormError('Invalid hash')
            setHashFormStatus(2)
        }
    }

    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Transaction Details">
                    <TransactionBlock className="dashboard-border">
                        <div className="transaction-amount-wrapper">
                            <div className="transaction-amount">{transaction?.amount}&nbsp;{transaction?.walletAddress?.token?.symbol}</div>
                            <div className="transaction-amount-token">
                                <img className="transaction-amount-token-image" src={transaction?.walletAddress?.token?.image} alt="USDT" />
                                <div>{transaction?.walletAddress?.token?.name} {transaction?.walletAddress?.token?.smartContract != '' ? `(${transaction?.walletAddress?.token?.network.symbol})` : ''} <span>{transaction?.walletAddress?.token?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-end px-4">
                            <TransactionDetails>
                                <TransactionDetailsRow title="Type" value={transaction?.type.type ? transaction.type.type == 'withdraw' ? 'Withdraw' : transaction.type.type == 'receive' ? "Add funds" : transaction.type.type == 'stake' ? "Deposit" : transaction.type.type == 'unstake' ? "Close deposit" : transaction.type.type == "refBonus" ? "Referral bonus" : transaction.type.type == 'bonus' ? "Bonus" : "" : <div className='loader'></div>} />
                                <TransactionDetailsRow title="Status" value={transaction?.status.status ? <span className={transaction.status.status == 'completed' ? "success" : transaction.status.status == "error" ? "error" : ''}>{transaction.status.status}</span> : <div className='loader'></div>} />
                                <TransactionDetailsRow title="Date" value={`${new Date(transaction?.dateCreated ? transaction.dateCreated : 0).getDate()}.${new Date(transaction?.dateCreated ? transaction.dateCreated : 0).getMonth() + 1}.${new Date(transaction?.dateCreated ? transaction.dateCreated : 0).getFullYear()}`} />
                                <TransactionDetailsRow title="Network" value={`${transaction?.walletAddress?.token?.network?.name} Network`} />
                                <TransactionDetailsRow title="Amount" value={`${Number(Number(transaction?.amount) * Number(transaction?.walletAddress?.token?.price)).toFixed(7)} $`} />
                                <TransactionDetailsRow title="Pay to account" value={transaction?.walletAddress?.address ? transaction.walletAddress.address : ''} copy={true} />
                                <TransactionDetailsRow title="Amount to add" value={transaction?.amount ? String(transaction?.amount) : "0"} copy={true} additional={transaction?.walletAddress?.token?.symbol} />
                            </TransactionDetails>
                            <div className="flex-row justify-start my-4 transaction-details">
                                <div style={{ width: "50%", minWidth: "50%" }}></div>
                                <div style={{ width: "150px", height: "150px" }} className="flex items-center qr-image" ref={qrContainerRef}></div>
                            </div>
                            <div className={`flex justify-between flex-col sm:items-center sm:flex-row gap-4 w-full${hashFormError != undefined ? ' mb-0' : ' mb-4'}`}>
                                <div className={`w-full hash-input-wrapper${hashFormError != undefined || hashFormError == "" ? ' error' : ''}`}>
                                    <input className="" disabled={hashFormStatus == 3 || hashFormStatus == 1 ? true : false} type="text" placeholder="Enter the hash after sending your funds" onChange={hashInputChange} onFocus={hashInputFocus} onBlur={hashInputBlur} value={hashInput} />
                                </div>
                                <button className="px-8 py-2 h-full hash-input-past" onClick={sendHashInput} disabled={hashFormStatus == 3 || hashFormStatus == 1 ? true : false}>
                                    {
                                        hashFormStatus == 3 ?
                                            <i className="ri-checkbox-circle-fill" />
                                            :
                                            hashFormStatus == 1 ?
                                                <div className='loader'></div>
                                                :
                                                "Send"
                                    }
                                </button>
                            </div>
                            {transaction?.status.status == 'prepared' ?
                                <>
                                    {
                                        hashFormError != undefined ? <div className="form-error mb-4 w-full">{hashFormError}</div> : ''
                                    }
                                    <div className={`w-full transaction-cancel-wrapper${hashFormStatus == 3 ? ' hidden' : ""}`}>
                                        <button className="transaction-cancel-button" onClick={closeTransaction}>Close Order</button>
                                    </div>
                                </>
                                :
                                <></>
                            }
                        </div>
                    </TransactionBlock>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}