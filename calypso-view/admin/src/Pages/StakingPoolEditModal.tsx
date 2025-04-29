import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../constants";
import { UsersContext } from "../Contexts/AppContext";
import { IUserStakeContext } from "../Types";
import { logoutHandler } from "../Hooks/helpers";
import { useNavigate } from "react-router-dom";




export const StakingPoolEditModal = ({ data }: { data: { modalOpen: boolean, setModalOpen: any, stakingPool?: IUserStakeContext } }) => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [date, setDate] = useState<string>()
    const { usersContext, setUsersContext } = useContext(UsersContext)

    const [reward, setReward] = useState<string>()
    const [amount, setAmount] = useState<string>()
    const [finalize, setFinalize] = useState<boolean>()
    // const [payout, setPayout] = useState<boolean>()

    useEffect(() => {
        setReward(data?.stakingPool?.periodReward ? String(data.stakingPool.periodReward) : "0")
        setAmount(data?.stakingPool?.amount ? String(data.stakingPool.amount) : "0")
        setFinalize(data?.stakingPool?.closed)
        setDate(data?.stakingPool?.dateCreated.split(".")[0])
        console.log(data?.stakingPool?.dateCreated)
    }, [])

    useEffect(() => {
        setReward(data?.stakingPool?.periodReward ? String(data.stakingPool.periodReward) : "0")
        setAmount(data?.stakingPool?.amount ? String(data.stakingPool.amount) : "0")
        setFinalize(data?.stakingPool?.closed)
        setDate(data?.stakingPool?.dateCreated.split(".")[0])
        console.log(data?.stakingPool?.dateCreated)
    }, [data?.stakingPool])

    useEffect(() => {
        setReward(data?.stakingPool?.periodReward ? String(data.stakingPool.periodReward) : "0")
        setAmount(data?.stakingPool?.amount ? String(data.stakingPool.amount) : "0")
        setFinalize(data?.stakingPool?.closed)
    }, [usersContext])

    const navigate = useNavigate()

    const changeStaking = () => {
        setButtonLoading(true)
        axios.post(SERVER_URL + '/admin/stake/update', { userStakeId: data?.stakingPool?.id, closed: finalize, reward: reward, dateCreated: date }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then((response) => {
                console.log(response)
                axios.post(SERVER_URL + '/admin/user/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                    .then((response) => {
                        setUsersContext(response.data)
                        data?.setModalOpen(false)
                        setButtonLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                        if (error.status == 401 || error.code == "ERR_NETWORK") {
                            console.log("Invalid Token")
                            logoutHandler()
                            navigate('/login/')
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

    return (
        <div className="absolute flex-1 w-0 h-0" style={{ display: data?.modalOpen == true ? 'flex' : 'none' }}>
            <div className="absolute w-dvw h-dvh">
                <div className="z-50 w-full h-full">
                    <div className="tw-overlay"></div>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex justify-center items-center p-4 min-h-full text-center">
                            <div className="tw-overlay2" onClick={() => { data?.setModalOpen(false); }}></div>
                            <div className="bg-backgroundPrimary shadow-xl px-4 py-4 rounded-lg w-full max-w-md text-left transform transition-all overflow-hidden align-middle">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-textPrimary text-unset header-text">Изменить стейкинг</h3>
                                    </div>
                                    <div>
                                        <div className="flex w-full">
                                            <button type="button" className="bg-transparent p-0 w-full text-backgroundPrimary default-button outline-none" onClick={() => { data?.setModalOpen(false); }}>
                                                <svg className="text-iconNormal" fill="none" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.69611 5.07538L4.57479 7.1967L9.87809 12.5L4.57479 17.8033L6.69611 19.9246L11.9994 14.6213L17.3027 19.9246L19.424 17.8033L14.1207 12.5L19.424 7.1967L17.3027 5.07538L11.9994 10.3787L6.69611 5.07538Z" fill="currentColor"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex flex-col space-y-4 min-h-[400px]">
                                        <div className="form-change">
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">ID</label>
                                                <input name="walletSeed" value={data?.stakingPool?.id} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletName">Сеть</label>
                                                <input name="walletSeed" value={data?.stakingPool?.token.network.symbol + "(" + data?.stakingPool?.token?.symbol + ")"} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Сумма</label>
                                                <input name="walletSeed" value={amount} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Награда</label>
                                                <input name="walletSeed" value={reward} onChange={(event) => setReward(event.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Завершен</label>
                                                <input type="checkbox" checked={finalize} onChange={() => setFinalize(!finalize)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDate">Время</label>
                                                <input name="walletDate" type="datetime-local" value={date} onChange={(event) => setDate(event?.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <button className="swap_percent_btn" disabled={buttonLoading} onClick={changeStaking}>
                                                    <p>Сохранить</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}