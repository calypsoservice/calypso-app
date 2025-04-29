import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../constants"
import { IUserContext, IWalletTransaction } from "../Types"
import { UsersContext } from "../Contexts/AppContext"
import { TransactionAddModal } from "./TransactionAddModal"
import { TransactionEditModal } from "./TransactionEditModal"
import { logoutHandler, reverseArr, toLocalTime } from "../Hooks/helpers"




export const TransactionsPage = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState<IUserContext>()
    const { id } = useParams()
    const { usersContext, setUsersContext } = useContext(UsersContext)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalOpen2, setModalOpen2] = useState<boolean>(false)
    const [selectedTransaction, setSelectedTransaction] = useState<IWalletTransaction>()
    const [transactions, setTransactions] = useState<IWalletTransaction[]>()

    useEffect(() => {
        const setter = () => {
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
                    setUser(us)
                    setTransactions(reverseArr(us.walletTransactions))
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
                            setTransactions(reverseArr(us.walletTransactions))
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
                    setTransactions(reverseArr(us.walletTransactions))
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
                            <h3>Транзакции кошелька</h3>
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
                                    <a data-bs-original-title="" title="">Информация о транзакциях</a>
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
                            <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                                <h4>Список транзакций</h4>
                                <input className="jsgrid-button jsgrid-insert-mode-button jsgrid-mode-button" type="button" onClick={() => setModalOpen2(true)} />
                            </div>
                            <div className="card-body">
                                <div className="jsgrid">
                                    <div className="jsgrid-grid-body">
                                        <table className="jsgrid-table">
                                            <thead style={{ borderBottom: "1px solid #e9e9e9;" }}>
                                                <tr className="jsgrid-header-row">
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">ID</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Статус</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Тип</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Тариф</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Скрыта</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Монета</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Hash</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Время</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Аддресс</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Количество</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable action">Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions?.map((tr: IWalletTransaction) => { return <TransactionListBlock transactionData={tr} setTransaction={setSelectedTransaction} setModalOpen={setModalOpen} /> })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TransactionEditModal data={{ modalOpen: modalOpen, setModalOpen: setModalOpen, transaction: selectedTransaction, setTransaction: setSelectedTransaction }} />
            <TransactionAddModal data={{ modalOpen: modalOpen2, setModalOpen: setModalOpen2 }} />
        </>
    )
}


const TransactionListBlock = ({ transactionData, setTransaction, setModalOpen }: { transactionData: IWalletTransaction, setTransaction: any, setModalOpen: any }) => {
    return (
        <tr className="jsgrid-row">
            <td className="jsgrid-cell default">ID:{transactionData.id}</td>
            <td className="jsgrid-cell default">{transactionData.status.status}</td>
            <td className="jsgrid-cell default">{transactionData.type.type == 'withdraw' ? 'Списание' : transactionData.type.type == 'receive' ? "Ввод средств" : transactionData.type.type == 'stake' ? "Депозит" : transactionData.type.type == 'unstake' ? "Закрытие депозита" : transactionData.type.type == "refBonus" ? "Реферальный бонус" : transactionData.type.type == 'bonus' ? "Bonus" : ""}</td>
            <td className="jsgrid-cell default">{transactionData.userStake?.stake.name}</td>
            <td className="jsgrid-cell default">{transactionData.hidden ? "Да" : "Нет"}</td>
            <td className="jsgrid-cell default">{transactionData.walletAddress.token?.network.symbol} {transactionData.walletAddress.token?.symbol}</td>
            <td className="jsgrid-cell description">
                {transactionData.receiveHash}
            </td>
            <td className="jsgrid-cell default">{toLocalTime(String(transactionData.dateCreated?.toString())).toLocaleString()}</td>
            <td className="jsgrid-cell description">{transactionData.receiveAddress}</td>
            <td className="jsgrid-cell default">{(transactionData?.amount ? +transactionData.amount : +0).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}</td>
            <td className="jsgrid-align-center jsgrid-cell jsgrid-control-field action">
                <input className="jsgrid-button jsgrid-edit-button" type="button" title="" data-bs-original-title="Edit" aria-label="Edit" onClick={() => { setTransaction(transactionData); setModalOpen(true) }} />
                {/* <input className="jsgrid-button jsgrid-delete-button" type="button" title="" data-bs-original-title="Delete" aria-label="Delete" /> */}
            </td>
        </tr>
    )
}
