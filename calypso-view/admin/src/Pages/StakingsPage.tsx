import axios from "axios"
import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SERVER_URL, HEADERS } from "../constants"
import { UsersContext } from "../Contexts/AppContext"
import { IUserContext, IUserStakeContext } from "../Types"
import { StakingPoolEditModal } from "./StakingPoolEditModal"
import { addDaysDstFail, leftPercentOfPeriod, logoutHandler, reverseArr, toLocalTime } from "../Hooks/helpers"



export const StakingsPage = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState<IUserContext>()
    const { usersContext, setUsersContext } = useContext(UsersContext)
    const { id } = useParams()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedStaking, setSelectedStaking] = useState<IUserStakeContext>()
    const [stakings, setStakings] = useState<IUserStakeContext[]>()

    useEffect(() => {
        const setter = () => {
            usersContext?.forEach((us) => {
                if (Number(id) == us.id) {
                    setUser(us)
                    setStakings(reverseArr(us.userStakes))
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
                            setStakings(reverseArr(us.userStakes))
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
                    setStakings(reverseArr(us.userStakes))
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
                            <h3>Депозиты кошелька</h3>
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
                                    <a data-bs-original-title="" title="">Информация о депозитах</a>
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
                                <h4>Список депозитов</h4>
                                {/* <input className="jsgrid-button jsgrid-insert-mode-button jsgrid-mode-button" type="button" /> */}
                            </div>
                            <div className="card-body">
                                <div className="jsgrid">
                                    <div className="jsgrid-grid-body">
                                        <table className="jsgrid-table">
                                            <thead style={{ borderBottom: "1px solid #e9e9e9;" }}>
                                                <tr className="jsgrid-header-row">
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">ID</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Пакет</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Прогресс</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Сумма</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Токен</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Награда</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable default">Окончен</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Дата создания</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable description">Дата окончания</th>
                                                    <th className="jsgrid-header-cell jsgrid-header-sortable action">Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stakings?.map((sp: IUserStakeContext) => { return <StakingListBlock stakePool={sp} setSelectedStaking={setSelectedStaking} setModalOpen={setModalOpen} />})}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <StakingPoolEditModal data={{modalOpen: modalOpen, setModalOpen: setModalOpen, stakingPool: selectedStaking}} />
        </>
    )
}


const StakingListBlock = ({ stakePool, setSelectedStaking, setModalOpen }: { stakePool: IUserStakeContext, setSelectedStaking: any, setModalOpen: any }) => {

    const [endStakeDate] = useState<Date>(addDaysDstFail(new Date(stakePool.dateCreated), stakePool.stake.periodDays))
    const [completePercent] = useState<number>(leftPercentOfPeriod(new Date(stakePool.dateCreated), stakePool.stake.periodDays))
    
    return (
        <tr className="jsgrid-row">
            <td className="jsgrid-cell default">ID:{stakePool.id}</td>
            <td className="jsgrid-cell default">{stakePool.stake.name}</td>
            <td className="jsgrid-cell default">{completePercent < 100 ? completePercent.toFixed(2) : 100}%</td>
            <td className="jsgrid-cell default">{stakePool.amount}</td>
            <td className="jsgrid-cell default">{stakePool.token?.network.symbol} ({stakePool.token?.symbol})</td>
            <td className="jsgrid-cell default">{stakePool.periodReward}</td>
            <td className="jsgrid-cell default"><div className="flex justify-center align-center"><input type="checkbox" checked={stakePool.closed} /></div></td>
            <td className="jsgrid-cell default">
                {toLocalTime(stakePool.dateCreated.toString()).toLocaleString()}
            </td>
            <td className="jsgrid-cell default">
                {toLocalTime(endStakeDate.toString()).toLocaleString()}
            </td>
            <td className="jsgrid-align-center jsgrid-cell jsgrid-control-field action">
                <input className="jsgrid-button jsgrid-edit-button" type="button" title="" data-bs-original-title="Edit" aria-label="Edit" onClick={() => {setSelectedStaking(stakePool); setModalOpen(true)}} />
                {/* <input className="jsgrid-button jsgrid-delete-button" type="button" title="" data-bs-original-title="Delete" aria-label="Delete" /> */}
            </td>
        </tr>
    )
}
