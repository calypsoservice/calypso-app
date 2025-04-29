import React, { useContext, useEffect, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { AppContext } from "../../Contexts/AppContext"
import { IStakeContext, IWalletContext } from "../../Types"
import axios from "axios"
import { HEADERS, SERVER_URL } from "../../constants"
import { logoutHandler } from "../../Hooks/helpers"
import { useNavigate } from "react-router-dom"



export const Deposite = () => {

    const { appContext, setAppContext } = useContext(AppContext)

    const [stakingPlanTab] = useState([
        {
            id: 1,
            title: "Starter",
            icon: "ri-award-line"
        },
        {
            id: 2,
            title: "Advanced",
            icon: "ri-medal-2-line"
        },
        {
            id: 3,
            title: "Profesional",
            icon: "ri-bar-chart-grouped-fill"
        }
    ])

    const [stakingPlanTabId, setStakingPlanTabId] = useState<number>(1)

    const [selectedPlan, setSelectedPlan] = useState<IStakeContext>()

    const [currencySelect, setCurrencySelect] = useState<boolean>(false)
    const [currencySelected, setCurrencySelected] = useState<IWalletContext>()
    const [minValue, setMinValue] = useState<number>(50)
    const [maxValue, setMaxValue] = useState<number>(500)
    const [valueInput, setValueInput] = useState<string|undefined>()
    const [valueInputError, setValueInputError] = useState<number | undefined>()

    const [formError, setFormError] = useState<string | undefined>()
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)

    const inputValueBlur = () => {
        if (Number(minValue) <= Number(valueInput) && Number(valueInput) <= Number(maxValue)) {
            var error = true
            console.log(appContext.user)
            appContext.user?.userWallet.walletAddresses.forEach(wa => {
                if (wa.id == currencySelected?.id) {
                    if (Number(valueInput) <= Number(wa.balance)) {
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

    useEffect(() => {
        if (selectedPlan) {
            appContext.stakes?.forEach(st => selectedPlan.id == st.id ? setSelectedPlan(st) : null)
        }
        setSelectedPlan(appContext.stakes ? appContext.stakes[0] : undefined)
    }, [appContext.stakes])

    useEffect(() => {
        if (currencySelected) {
            appContext.user?.userWallet.walletAddresses?.forEach(tk => tk.id == currencySelected.id ? setCurrencySelected(tk) : null)
        }
        setCurrencySelected(appContext.user?.userWallet.walletAddresses ? appContext.user?.userWallet.walletAddresses[0] : undefined)
    }, [appContext.user, appContext.tokens])

    useEffect(() => {
        console.log(selectedPlan)
        console.log(appContext.stakes ? appContext.stakes[0].id == selectedPlan?.id ? ' active' : '' : '')
    }, [selectedPlan])


    useEffect(() => {
        setMinValue(Number((Number(selectedPlan?.minAmount) / Number(currencySelected?.token.price)).toFixed(7)))
        setMaxValue(Number((Number(selectedPlan?.maxAmount) / Number(currencySelected?.token.price)).toFixed(7)))
    }, [selectedPlan, currencySelected])

    const navigate = useNavigate()

    const stakeNow = () => {
        if (valueInputError !== undefined) return
        setFormStatus(1)
        const data = {
            "userId": appContext?.user?.id,
            "stakeId": selectedPlan?.id,
            "tokenId": currencySelected?.token.id,
            "amount": valueInput
        }
        axios.post(SERVER_URL + '/stake/stake', data, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(async (r) => {
                console.log(r)
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
                        setAppContext({...appContext, user: user})
                        navigate('/deposits')
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
            .catch(e => {
                console.log(e)
                setFormError("Invalid data")
                setFormStatus(2)
            })
    }

    console.log("VALUE INPUT ERROR:")
    console.log(valueInputError)

    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Create Deposit">
                    <div className="deposite-plans-section">
                        <div className="deposite-plans-section-title">Choose Deposit Plan</div>
                        <div className="deposite-plans-section-subtitle">
                            <p>Familiarize yourself and choose a convenient deposit option.</p>
                        </div>
                        <div className="deposite-plans-tabs">
                            {stakingPlanTab.map(spt =>
                                <div className={`deposite-plans-tab${spt.id == stakingPlanTabId ? " active" : ''}`} onClick={() => setStakingPlanTabId(spt.id)}>
                                    <i className={spt.icon} />
                                    {spt.title}
                                </div>
                            )}
                        </div>
                        <div className="deposite-plan-select">
                            {stakingPlanTab.map(spt => {
                                if (spt.id == stakingPlanTabId) {
                                    if (spt.id == 1) {
                                        return (
                                            <>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[0].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[0] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[0]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[0]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[0]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[0]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[0]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[1].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[1] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[1]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[1]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[1]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[1]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[1]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                    else if (spt.id == 2) {
                                        return (
                                            <>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[2].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[2] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[2]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[2]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[2]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[2]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[2]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[3].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[3] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[3]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[3]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[3]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[3]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[3]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[4].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[4] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[4]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[4]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[4]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[4]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[4]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                    else if (spt.id == 3) {
                                        return (
                                            <>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[5].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[5] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[5]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[5]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[5]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[5]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[5]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`deposite-plan-block${appContext.stakes ? appContext.stakes[6].id == selectedPlan?.id ? ' active' : '' : ''}`} onClick={() => setSelectedPlan(appContext.stakes ? appContext.stakes[6] : undefined)}>
                                                    <div className="deposite-plan-item">
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-title">{appContext?.stakes ? appContext.stakes[6]?.name : ''}</div>
                                                            <div className="deposite-plan-item-title">{appContext.stakes ? appContext.stakes[6]?.minAmount : ''}$-{appContext.stakes ? appContext.stakes[6]?.maxAmount : ''}$</div>
                                                        </div>
                                                        <div className="deposite-plan-item-row">
                                                            <div className="deposite-plan-item-percent">{appContext?.stakes ? appContext.stakes[6]?.percentDay : ''}%</div>
                                                            <div className="deposite-plan-item-text">for {appContext?.stakes ? appContext.stakes[6]?.periodDays : ''} days</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                }
                            })}
                        </div>
                    </div>
                    <div className="deposite-plans-section">
                        <div className="deposite-plans-section-title">Amount</div>
                        <div className="deposite-plans-section-subtitle">
                            <p>Select the amount and payment system for deposit.</p>
                        </div>
                        <div className="balance-row">
                            <div className="balance-col">
                                <div className="balance-block">
                                    <p>
                                        Your balance:&nbsp;
                                        <span>{currencySelected?.balance !== null ? Number(currencySelected?.balance).toFixed(7) : (0).toFixed(7)}&nbsp;{currencySelected?.token.symbol}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="deposite-amount-wrapper">
                            <div className="deposite-amount">
                                <div className="deposite-amoun-currency-wrapper">
                                    <i className="ri-arrow-down-line" />
                                    <div className="deposite-amoun-currency-select-btn" onClick={() => setCurrencySelect(!currencySelect)}>
                                        <img src={currencySelected?.token.image} alt="" />
                                        <p>
                                            <span>{currencySelected?.token.name}{currencySelected?.token.smartContract != "" ? ` (${currencySelected?.token.network.symbol})` : ''}</span>&nbsp;
                                            <span>{currencySelected?.token.symbol}</span>
                                        </p>
                                    </div>
                                    <div className={`deposite-currency-select${currencySelect ? ' active' : ''}`}>
                                        <div className="deposite-currency-select-list">
                                            {
                                                appContext.tokens?.map(tk => {
                                                    return (
                                                        <label htmlFor="" className={`deposite-currency-select-element${currencySelected?.token.id == tk.id ? " active" : ''}`} onClick={() => { appContext.user?.userWallet.walletAddresses?.forEach(wl => wl.token.id == tk.id ? setCurrencySelected(wl) : null); setCurrencySelect(false) }}>
                                                            <img src={tk.image} alt="" />
                                                            <p>
                                                                <span>{tk.name}{tk.smartContract != "" ? ` (${tk.network.symbol})` : ''}</span>
                                                                <span>{tk.symbol}</span>
                                                            </p>
                                                        </label>
                                                    )
                                                })
                                            }
                                            {/* <label htmlFor="" className="deposite-currency-select-element active" onClick={() => { setCurrencySelected(1); setCurrencySelect(false) }}>
                                                <img src={USDT_ICON} alt="" />
                                                <p>
                                                    <span>Tether (TRC20)</span>
                                                    <span>USDT</span>
                                                </p>
                                            </label>
                                            <label htmlFor="" className="deposite-currency-select-element" onClick={() => { setCurrencySelected(1); setCurrencySelect(false) }}>
                                                <img src={USDT_ICON} alt="" />
                                                <p>
                                                    <span>Tether (TRC20)</span>
                                                    <span>USDT</span>
                                                </p>
                                            </label> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="dep deposite-amount-input-wrapper">
                                    <input type="number" placeholder="Enter amount for deposit" value={valueInput} onChange={(event) => setValueInput(event?.target.value)} onFocus={inputValueFocus} onBlur={inputValueBlur} />
                                </div>
                                {/* <div className="depoiste-amount-currency">
                                    USD
                                </div> */}
                            </div>
                            <span className={valueInputError == 0 || valueInputError == 1 ? 'error mt-1' : 'mt-1'}>{valueInputError == undefined ? `Enter the amount in this range: ${minValue} ${currencySelected?.token.symbol} - ${maxValue} ${currencySelected?.token.symbol}`: valueInputError == 0 ? `Enter the amount in this range: ${minValue} ${currencySelected?.token.symbol} - ${maxValue} ${currencySelected?.token.symbol}` : valueInputError == 1 ? `Not enough balance` : ""}</span>
                        </div>
                    </div>
                    <div className="deposite-plans-section">
                        <div className="deposite-plans-section-title">Transaction details</div>
                        {/* <div className="deposite-plans-section-subtitle">
                            <p>Familiarize yourself and choose a convenient staking option.</p>
                        </div> */}
                        <div className="deposite-plan-info-list">
                            <div className="deposite-plan-info-item">
                                <h3>
                                    <i className="ri-briefcase-2-line" />
                                    Plan
                                </h3>
                                <p>{selectedPlan?.name}</p>
                            </div>
                            <div className="deposite-plan-info-item">
                                <h3>
                                    <i className="ri-briefcase-2-line" />
                                    Start Date
                                </h3>
                                <p>{`${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`}</p>
                            </div>
                            <div className="deposite-plan-info-item">
                                <h3>
                                    <i className="ri-briefcase-2-line" />
                                    Period
                                </h3>
                                <p>{selectedPlan?.periodDays} days</p>
                            </div>
                            <div className="deposite-plan-info-item">
                                <h3>
                                    <i className="ri-briefcase-2-line" />
                                    Reward
                                </h3>
                                <p>{selectedPlan?.name == 'Largo 1' ? "260" : selectedPlan?.name == 'Largo 2' ? "570" : (Number(selectedPlan?.percentDay) * Number(selectedPlan?.periodDays)).toFixed(2)}%</p>
                            </div>
                            <div className="deposite-plan-info-item">
                                <h3>
                                    <i className="ri-briefcase-2-line" />
                                    Amount
                                </h3>
                                <p>{valueInput === undefined || valueInput == '' ? 0 : valueInput}</p>
                            </div>
                        </div>
                        <div className="deposite-info-title">Profit</div>
                        <div className="deposite-info-profit">
                            <div className="deposite-info-profit-item">
                                <h3>Daily</h3>
                                <p>
                                    <span className="deposite-info-daily">{valueInput && selectedPlan?.percentDay ? ((Number(valueInput) * Number(selectedPlan?.percentDay)) / 100).toFixed(7) : '0'}</span>&nbsp;
                                    <span className="deposite-info-currency">{currencySelected?.token.symbol}</span>
                                </p>
                            </div>
                            <div className="deposite-info-profit-item">
                                <h3>Total</h3>
                                <p>
                                    <span className="deposite-info-daily">{valueInput && selectedPlan?.percentDay && selectedPlan.periodDays ? ((Number(valueInput) * Number(selectedPlan?.percentDay)) / 100 * Number(selectedPlan?.periodDays)).toFixed(7) : '0'}</span>&nbsp;
                                    <span className="deposite-info-currency">{currencySelected?.token.symbol}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {
                        formError ?
                            <div className='form-error'>{formError}</div>
                            :
                            <></>
                    }
                    <div className="deposite-open">
                        <button onClick={stakeNow} disabled={formStatus == 1}>
                            {
                                formStatus == 1 ?
                                    <div className='loader'></div>
                                    :
                                    <>
                                        <i className="ri-arrow-right-down-fill text-xl"></i>
                                        Open Deposit
                                    </>
                            }
                        </button>
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}