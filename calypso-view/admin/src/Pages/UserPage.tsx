import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../constants"
import { IReferralUser, IUserContext, IWalletContext } from "../Types"
import { UsersContext } from "../Contexts/AppContext"
import { numberToUsdFormat } from "./UsersPage"
import { WalletChangeModal } from "./WalletChangeModal"
import { logoutHandler } from "../Hooks/helpers"



export const UserPage = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const [user, setUser] = useState<IUserContext>()
    const { usersContext, setUsersContext } = useContext(UsersContext)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedLevel, setSelectedLevel] = useState<number>(1)
    

    useEffect(() => {
        const setter = () => {
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
                    console.log("SET USER")
                    setUser(us)
                }
            })
        }
        if (usersContext) {
            setter()
        }
        else {
            axios.post(SERVER_URL + '/admin/user/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then((response) => {
                    console.log(response)
                    setUsersContext(response.data)
                    response.data.forEach((us: IUserContext) => {
                        if (Number(id) == us.id) {
                            console.log("SET USER")
                            setUser(us)
                        }
                    })
                })
                .catch((error) => {
                    console.log(error)
                    if (error.status == 401 || error.code == "ERR_NETWORK") {
                        console.log("Invalid Token")
                        logoutHandler()
                        navigate('/login/')
                    }
                })
        }
    }, [])

    useEffect(() => {
        const setter = () => {
            console.log("FOUND USER")
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
                    console.log("SET USER")
                    setUser(us)
                }
            })
        }
        setter()
    }, [usersContext])

    return (
        <>
            <div className="container-fluid">
                <div className="page-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Кошельёк</h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a onClick={() => window.location.href = '/'} data-bs-original-title="" title="">Список кошельков</a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a data-bs-original-title="" title="">Информация о кошельке</a>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Информация о кошельке</h4>
                            </div>
                            <div className="card-body">
                                <div id="basicScenario" className="jsgrid">
                                    <div className="jsgrid-grid-body">
                                        <table className="jsgrid-table">
                                            <thead style={{ borderBottom: "1px solid #e9e9e9;" }}>
                                                <tr className="jsgrid-header-row">
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable id">ID</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable seed">Seed</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Баланс</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Активный?</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Описание</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable action">Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {user ? <UserListBlock2 userData={user} setModalOpen={setModalOpen} /> : ''}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Чат</h4>
                            </div>
                            <div className="card-body" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "1rem" }}>
                                <button type="submit" data-bs-original-title="" className="all-tokens-btn" title="" onClick={() => navigate('/chat/' + String(user?.id))}>Открыть чат</button>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>
                                    Информация о кошельке
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="gap-2 gap-md-0 mb-2 row">
                                    <div className="col-12 col-md-6">
                                        <div className="p-4 text-center list_of_coins" data-hdid="352" onClick={() => window.location.href = '/user/tokens/' + id} style={{ backgroundColor: "var(--bs-secondary)", borderRadius: "15px", color: "var(--bs-white)" }}>
                                            <h5 style={{ margin: 0 }}>Список монет</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="p-4 text-center cursor-pointer list_of_transactions" data-hdid="352" onClick={() => window.location.href = '/user/transactions/' + id} style={{ backgroundColor: "var(--bs-secondary)", borderRadius: "15px", color: "var(--bs-white)" }}>
                                            <h5 style={{ margin: 0 }}>Список транзакций</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="gap-2 gap-md-0 row">
                                    <div className="col-12 col-md-6">
                                        <div className="p-4 text-center cursor-pointer list_of_staking" data-hdid="352" onClick={() => window.location.href = '/user/stakes/' + id} style={{ backgroundColor: "var(--bs-secondary)", borderRadius: "15px", color: "var(--bs-white)" }}>
                                            <h5 style={{ margin: 0 }}>Список депозитов</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>
                                    Информация о кошельке
                                </h4>
                            </div>
                            {user ?
                                <div className="card-body">
                                    <div className="referral-levels-row row">
                                        <div className={`col-1${selectedLevel == 1 ? ' active' : ''}`} onClick={() => setSelectedLevel(1)}>
                                            <p>Level 1</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 2 ? ' active' : ''}`} onClick={() => setSelectedLevel(2)}>
                                            <p>Level 2</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 3 ? ' active' : ''}`} onClick={() => setSelectedLevel(3)}>
                                            <p>Level 3</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 4 ? ' active' : ''}`} onClick={() => setSelectedLevel(4)}>
                                            <p>Level 4</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 5 ? ' active' : ''}`} onClick={() => setSelectedLevel(5)}>
                                            <p>Level 5</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 6 ? ' active' : ''}`} onClick={() => setSelectedLevel(6)}>
                                            <p>Level 6</p>
                                        </div>
                                        <div className={`col-1${selectedLevel == 7 ? ' active' : ''}`} onClick={() => setSelectedLevel(7)}>
                                            <p>Level 7</p>
                                        </div>
                                    </div>
                                    <div className="referrals-list-wrapper">
                                        {user ?
                                            (user as any)["childLVL" + selectedLevel].length > 0 ?
                                                <div className="referrals-list">
                                                    {(user as any)["childLVL" + selectedLevel].map((el: IReferralUser) => { return <ReferralListElement data={el} currentLevel={selectedLevel} /> })}
                                                </div>
                                                :
                                                <div className="refferals-list-not-found">
                                                    <h3>No Referrals At This Level</h3>
                                                </div>
                                            :
                                            <></>
                                        }
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <WalletChangeModal data={{ modalOpen, setModalOpen, user, setUser }} />
        </>
    )
}


export const ReferralListElement = ({ data, currentLevel }: { data: IReferralUser, currentLevel: number }) => {

    return (
        <div className="referrals-list-element">
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="cursor-pointer referral-list-element-title" onClick={() => window.location.href = '/user/' + data.id}>
                        {data.username}
                        <span className="referral-list-element-titlesub">{currentLevel} level</span>
                    </div>
                    <div className="referral-list-element-subtitle">Username</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        <Link to={`mailto:${data.email}`} target="_blank"><i className="ri-message-2-line"></i></Link>
                    </div>
                    <div className="referral-list-element-subtitle">Contacts</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        ${Number(data.amountStake).toFixed(2)}
                    </div>
                    <div className="referral-list-element-subtitle">Invested</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        ${Number(data.amountParentReward).toFixed(2)}
                    </div>
                    <div className="referral-list-element-subtitle">Commission</div>
                </div>
            </div>
        </div>
    )
}

export const UserListBlock2 = ({ userData, link, setModalOpen }: { userData: IUserContext | undefined, setModalOpen: any, link?: string }) => {

    const [walletBalance, setWalletBalance] = useState<any>()

    useEffect(() => {
        var balance = 0
        userData?.userWallet.walletAddresses?.forEach((tk: IWalletContext) => {
            balance += Number(numberToUsdFormat(tk.balance, tk.token.price))
        })
        setWalletBalance((+balance).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'))
    }, [])

    useEffect(() => {
        var balance = 0
        userData?.userWallet.walletAddresses?.forEach((tk: IWalletContext) => {
            balance += Number(numberToUsdFormat(tk.balance, tk.token.price))
        })
        setWalletBalance((+balance).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'))
    }, [userData])

    const clicked = () => {
        if (link) {
            window.location.href = link
        }
    }
    // console.log("USER DATA")
    // console.log(userData)
    if (userData !== undefined && typeof (userData) !== typeof ([])) return (<></>)
    return (
        <tr className="jsgrid-row" onClick={clicked}>
            <td className="jsgrid-cell default">ID:{userData?.id}</td>
            <td className="jsgrid-cell seed">{userData?.userData.mnemonic ? userData.userData.mnemonic : ''}</td>
            <td className="jsgrid-cell default">{walletBalance} $</td>
            <td className="jsgrid-cell default"><div className="flex justify-center align-center"><input type="checkbox" checked={!userData?.blocked} /></div></td>
            <td className="jsgrid-cell description">{userData?.userData.description == null ? '' : userData.userData.description}</td>
            <td className="jsgrid-align-center jsgrid-cell jsgrid-control-field action">
                <input className="jsgrid-button jsgrid-edit-button" type="button" title="" data-bs-original-title="Edit" aria-label="Edit" onClick={() => setModalOpen(true)} />
                {/* <input className="jsgrid-button jsgrid-delete-button" type="button" title="" data-bs-original-title="Delete" aria-label="Delete" /> */}
            </td>
        </tr>
    )
}
