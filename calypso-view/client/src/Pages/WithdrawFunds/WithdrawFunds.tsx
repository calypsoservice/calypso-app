import React, { useContext, useEffect, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { GridColsTwoOneFour } from "../../Components/DashboardBlock"
import { AddFundsBlockSecond } from "../../Components/AddFundsBlock"
// import { useNavigate } from "react-router-dom"
import { AppContext } from "../../Contexts/AppContext"
import { ITokenContext } from "../../Types"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../../constants"
import { hash } from "../../Hooks/helpers"


export const WithdrawFunds = () => {

    const [selectedToken, setSelectedToken] = useState<ITokenContext | undefined>()
    const [amount, setAmountInput] = useState<string>('')
    const [addressInput, setAddressInput] = useState<string>('')
    const [memoInput, setMemoInput] = useState<string>('')
    const [minValue, setMinValue] = useState<string>("20")
    const [valueInputError, setValueInputError] = useState<number | undefined>()
    // const [memoInputError, setMemoInputError] = useState<string | undefined>()
    const [addressInputError, setAddressInputError] = useState<string | undefined>()

    const [formStatus, setFormStatus] = useState<0 | 1>(0)
    const { appContext } = useContext(AppContext)

    // const navigate = useNavigate()

    const inputValueBlur = () => {
        if (Number(minValue) <= Number(amount)) {
            var error = true
            appContext.user?.userWallet.walletAddresses.forEach(wa => {
                if (wa.token.id == selectedToken?.id) {
                    if (Number(amount) <= Number(wa.balance)) {
                        error = false
                    }
                }
            })
            if (error == true) {
                setValueInputError(1)
            }
            else {
                setValueInputError(undefined)
            }
        }
        else {
            setValueInputError(0)
        }
    }

    const inputValueFocus = () => {
        setValueInputError(undefined)
    }
    const addressValueBlur = () => {
        if (addressInput.length > 32) {
            setAddressInputError(undefined)
        }
        else {
            setAddressInputError('0')
        }
    }
    
    const addressValueFocus = () => {
        setAddressInputError(undefined)
    }

    const memoValueBlur = () => {
    }

    const memoValueFocus = () => {
    }

    const addFundsFunc = () => {
        // navigate("/transaction/1231313141/")
        if (valueInputError !== undefined) return
        if (addressInputError !== undefined) return
        setFormStatus(1)
        var waId = 0
        var hashTx = hash()
        appContext.user?.userWallet.walletAddresses.forEach(wa => {if (wa.token.id == selectedToken?.id) {waId = wa.id}})
        const data = {
            hash: hashTx,
            walletAddressId: waId,
            status: "prepared",
            type: "withdraw",
            userId: appContext.user?.id,
            amount: amount,
            receiveAddress: addressInput,
            memo: memoInput,
            hidden: false
            // walletAddressId: waId
        }
        axios.post(SERVER_URL + '/trans/save', data, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then((r) => {
                console.log(r)
                window.location.href = "/cashout/transaction/" + hashTx + '/'
            })
            .catch(e => {
                console.log(e)
                setFormStatus(0)
            })
    }

    useEffect(() => {
        if (appContext.tokens) {
            if (selectedToken) {
                appContext.tokens.forEach(tk => { if (tk.id == selectedToken.id) { setSelectedToken(tk) } })
            }
            setSelectedToken(appContext.tokens[0])
        }
    }, [appContext.tokens])

    useEffect(() => {
        setMinValue((20 / Number(selectedToken?.price)).toFixed(7))
    }, [selectedToken])

    const selectToken = (tk: ITokenContext) => {
        if (formStatus == 0) {
            setSelectedToken(tk)
        }
    }


    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Withdraw Funds">
                    <div className="deposite-plans-section-title">Choose Token</div>
                    <GridColsTwoOneFour className='mb-5'>
                        {appContext.tokens?.map(tk => {
                            return <AddFundsBlockSecond data={{ ...tk }} selected={selectedToken?.id == tk.id ? true : false} setSelectedToken={selectToken} />
                        })}
                    </GridColsTwoOneFour>
                    <div className="deposite-plans-section-title">Amount</div>
                    <div className="deposite-amount-wrapper second">
                        <div className="deposite-amount">
                            <div className="deposite-amount-input-wrapper">
                                <input type="number" disabled={formStatus == 1 ? true : false} placeholder="Enter amount for withdraw" value={amount} onBlur={inputValueBlur} onFocus={inputValueFocus} onChange={(event) => setAmountInput(event.target.value)} />
                            </div>
                            <div className="depoiste-amount-currency">
                                {selectedToken?.symbol}
                            </div>
                        </div>
                        <span className={valueInputError == 0 || valueInputError == 1 ? 'error' : ''}>{valueInputError == undefined ? `Enter the amount greater or equal than: ${minValue}${selectedToken?.symbol}` : valueInputError == 0 ? `Enter the amount greater or equal than: ${minValue}${selectedToken?.symbol}` : valueInputError == 1 ? "Not enough balance" : ""}</span>
                    </div>
                    <div className="deposite-plans-section-title">Address</div>
                    <div className="deposite-amount-wrapper second">
                        <div className="deposite-amount">
                            <div className="deposite-amount-input-wrapper">
                                <input type="text" disabled={formStatus == 1 ? true : false} placeholder="Enter withdraw address" value={addressInput} onBlur={addressValueBlur} onFocus={addressValueFocus} onChange={(event) => setAddressInput(event.target.value)} />
                            </div>
                        </div>
                        <span className={addressInputError == "0" ? 'error' : ''}>{addressInputError == "0" ? `Invalid address for ${selectedToken?.symbol}` : ""}</span>
                    </div>
                    {
                        selectedToken?.symbol == 'TON' ?
                            <>
                                <div className="deposite-plans-section-title">Memo</div>
                                <div className="deposite-amount-wrapper second">
                                    <div className="deposite-amount">
                                        <div className="deposite-amount-input-wrapper">
                                            <input type="text" disabled={formStatus == 1 ? true : false} placeholder="Enter memo if needed" value={memoInput} onBlur={memoValueBlur} onFocus={memoValueFocus} onChange={(event) => setMemoInput(event.target.value)} />
                                        </div>
                                    </div>
                                    {/* <span className={memoInputError == "0" ? 'error' : ''}>{memoInputError == "0" ? "Enter the amount greater or equal than:" : ""}</span> */}
                                </div>
                            </>
                            :
                            ''
                    }
                    <div className="deposite-open">
                        <button onClick={addFundsFunc} disabled={formStatus == 1 ? true : false}>
                            {
                                formStatus == 1 ?
                                    <div className="loader"></div>
                                    :
                                    <>
                                        <i className="ri-arrow-right-down-fill text-xl"></i>
                                        Withdraw funds
                                    </>
                            }
                        </button>
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}
