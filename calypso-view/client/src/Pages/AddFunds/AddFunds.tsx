import React, { useContext, useEffect, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { GridColsTwoOneFour } from "../../Components/DashboardBlock"
import { AddFundsBlockSecond } from "../../Components/AddFundsBlock"
// import { useNavigate } from "react-router-dom"
import { AppContext } from "../../Contexts/AppContext"
import { ITokenContext } from "../../Types"
import { hash } from "../../Hooks/helpers"
import axios from "axios"
import { HEADERS, SERVER_URL } from "../../constants"


export const AddFunds = () => {

    const [selectedToken, setSelectedToken] = useState<ITokenContext>()
    const [amount, setAmountInput] = useState<string>()
    const [minValue, setMinValue] = useState<string>("50")
    const [valueInputError, setValueInputError] = useState<number | undefined>()

    const { appContext } = useContext(AppContext)

    const inputValueBlur = () => {
        if (Number(minValue) <= Number(amount)) { // Number(minValue)
            setValueInputError(undefined)
        }
        else {
            setValueInputError(0)
        }
    }

    const inputValueFocus = () => {
        setValueInputError(undefined)
    }

    // const navigate = useNavigate()

    const addFundsFunc = () => {
        // navigate("/transaction/1231313141/")
        if (valueInputError !== undefined) return
        var waId = 0
        var hashTx = hash()
        appContext.user?.userWallet.walletAddresses.forEach(wa => {if (wa.token.id == selectedToken?.id) {waId = wa.id}})
        const data = {
            hash: hashTx,
            walletAddressId: waId,
            status: "prepared",
            type: "receive",
            userId: appContext.user?.id,
            amount: amount,
            hidden: true
            // walletAddressId: waId
        }
        axios.post(SERVER_URL + '/trans/save', data, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
                window.location.href = "/transaction/" + hashTx + '/'
            })
            .catch(e => {
                console.log(e)
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
        setMinValue((50 / Number(selectedToken?.price)).toFixed(7))
    }, [selectedToken])

    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Add Funds">
                    <div className="deposite-plans-section-title">Choose Token</div>
                    <GridColsTwoOneFour className='mb-5'>
                        {appContext.tokens?.map(tk => {
                            return <AddFundsBlockSecond data={{ ...tk }} selected={selectedToken?.id == tk.id ? true : false} setSelectedToken={setSelectedToken} />
                        })}
                    </GridColsTwoOneFour>
                    <div className="deposite-plans-section-title">Amount</div>
                    <div className="deposite-amount-wrapper second">
                        <div className="deposite-amount">
                            <div className="deposite-amount-input-wrapper">
                                <input type="number" placeholder="Enter amount" value={amount} onBlur={inputValueBlur} onFocus={inputValueFocus} onChange={(event) => setAmountInput(event.target.value)} />
                            </div>
                            <div className="depoiste-amount-currency">
                                {selectedToken?.symbol}
                            </div>
                        </div>
                        <span className={valueInputError == 0 || valueInputError == 1 ? 'error' : ''}>{valueInputError == 0 ? `Enter the amount greater or equal than: min ${minValue}${selectedToken?.symbol}` : valueInputError == 1 ? "Not enough balance" : ""}</span>
                    </div>
                    <div className="deposite-open">
                        <button onClick={addFundsFunc}>
                            <i className="ri-arrow-right-down-fill text-xl"></i>
                            Add funds
                        </button>
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}
