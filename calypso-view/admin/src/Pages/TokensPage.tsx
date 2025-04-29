import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../constants"
import { IUserContext, IWalletContext } from "../Types"
import { UsersContext } from "../Contexts/AppContext"
import { TokenChangeModal } from "./TokenChangeModal"
import { logoutHandler } from "../Hooks/helpers"



export const TokensPage = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState<IUserContext>()
    const { id } = useParams()
    const { usersContext, setUsersContext } = useContext(UsersContext)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [token, setToken] = useState<IWalletContext>()

    useEffect(() => {
        const setter = () => {
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
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
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
                    setUser(us)
                }
            })
        }
        setter()
    }, [usersContext])

    
    const returnTokensList = (tokens: IWalletContext[] | undefined) =>{
        var tkWithBalance: IWalletContext[] = []
        var tkWithoutBalance: IWalletContext[] = []
        tokens?.forEach((tk: IWalletContext) => {
            if (Number(tk.balance) > 0) {
                tkWithBalance.push(tk)
            }
            else {
                tkWithoutBalance.push(tk)
            }
        })
        tkWithBalance.sort((a, b) => (Number(b.balance) * Number(b.token.price)) - (Number(a.balance) * Number(a.token.price)))
        var tkList = tkWithBalance.concat(tkWithoutBalance)
        return tkList.map(tk =>
            <TokenListBlock tokenData={tk} modalOpen={modalOpen} setModalOpen={setModalOpen} setToken={setToken} />
        )
    }

    return (
        <>
            <div className="container-fluid">
                <div className="page-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Токены кошелька</h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a onClick={() => window.location.href = '/'} data-bs-original-title="" title="">Список кошельков</a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a onClick={() => window.location.href = '/user/' + user?.id} data-bs-original-title="" title="">Информация о кошельке</a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a data-bs-original-title="" title="">Информация о токенах</a>
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
                                <h4>Список монет</h4>
                            </div>
                            <div className="card-body">
                                <div className="jsgrid">
                                    <div className="jsgrid-grid-body">
                                        <table className="jsgrid-table">
                                            <thead style={{ borderBottom: "1px solid #e9e9e9;" }}>
                                                <tr className="jsgrid-header-row">
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Сеть</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Название</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Баланс</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Адресс</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable action">Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {returnTokensList(user?.userWallet.walletAddresses)}
                                                {/* {wallet?.tokens.map((tk: TTokenData) => <TokenListBlock tokenData={tk} modalOpen={modalOpen} setModalOpen={setModalOpen} setToken={setToken} />)} */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TokenChangeModal data={{ modalOpen, setModalOpen, token, setToken }} />
        </>
    )
}

const TokenListBlock = ({ tokenData, setModalOpen, setToken }: { tokenData: IWalletContext, modalOpen: boolean, setModalOpen: any, setToken: any }) => {
    return (
        <tr className="jsgrid-row">
            <td className="jsgrid-cell default">{tokenData.token.network.name}</td>
            <td className="jsgrid-cell default">{tokenData.token.symbol}</td>
            <td className="jsgrid-cell default">{(+tokenData.balance).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}</td>
            <td className="jsgrid-cell description">{tokenData.address}</td>
            <td className="jsgrid-align-center jsgrid-cell jsgrid-control-field action">
                <input className="jsgrid-button jsgrid-edit-button" type="button" title="" data-bs-original-title="Edit" aria-label="Edit" onClick={() => {setToken(tokenData); setModalOpen(true)}} />
                <input className="jsgrid-button jsgrid-delete-button" type="button" title="" data-bs-original-title="Delete" aria-label="Delete" />
            </td>
        </tr>
    )
}
