import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../constants";
import { UsersContext } from "../Contexts/AppContext";
import { IWalletTransaction } from "../Types";
import { logoutHandler } from "../Hooks/helpers";
import { useNavigate } from "react-router-dom";



export const TRANSACTION_STATUS_ENUM = ["prepared", "confirmation", "completed", "error"]
export const TRANSACTION_TYPE_ENUM = ["stake", "unstake", "receive", "withdraw", "refBonus", "bonus"]


export const TransactionEditModal = ({ data }: { data?: { modalOpen: boolean, setModalOpen: any, transaction?: IWalletTransaction, setTransaction: any } }) => {

    const [selectedStatus, setSelectedStatus] = useState<string>()
    const [date, setDate] = useState<string>()
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [memoInput, setMemoInput] = useState<string>()
    const [hidden, setHidden] = useState<boolean>(false)
    const { setUsersContext } = useContext(UsersContext)

    const [addressFrom, setAddressFrom] = useState<string>()
    // const [addressTo, setAddressTo] = useState<string>()

    useEffect(() => {
        if (data?.transaction) {
            setSelectedStatus(data?.transaction?.status.status)
            setAddressFrom(data?.transaction?.type.type == 'withdraw' ? data.transaction.receiveAddress : data?.transaction?.walletAddress.address)
            setMemoInput(data?.transaction?.memo)
            setDate(data?.transaction?.dateCreated.split(".")[0])
            setHidden(data?.transaction?.hidden)
        }
        // setAddressTo(data?.transaction?.toAddress)
    }, [])

    useEffect(() => {
        if (data?.transaction) {
            setSelectedStatus(data?.transaction?.status.status)
            setAddressFrom(data?.transaction?.type.type == 'withdraw' ? data.transaction.receiveAddress : data?.transaction?.walletAddress.address)
            setMemoInput(data?.transaction?.memo)
            setDate(data?.transaction?.dateCreated.split(".")[0])
            setHidden(data?.transaction?.hidden)
        }
        // setAddressTo(data?.transaction?.toAddress)
    }, [data?.transaction])

    const navigate = useNavigate()

    const changeTransaction = () => {
        setButtonLoading(true)
        var dt: any = {
            id: data?.transaction?.id,
            status: selectedStatus,
            dateCreated: date,
            hidden: hidden
        }
        if (data?.transaction?.type.type == 'withdraw') {
            dt = { ...dt, receiveAddress: addressFrom, memo: memoInput }
        }
        axios.post(SERVER_URL + '/admin/transaction/update', dt, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
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
            .catch(e => {
                console.log(e)
                if (e.status == 401 || e.code == "ERR_NETWORK") {
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
                                        <h3 className="font-semibold text-textPrimary text-unset header-text">Изменить транзакию</h3>
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
                                                <label htmlFor="walletName">ID</label>
                                                <input type="text" name="walletName" value={data?.transaction?.id} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Статус</label>
                                                <select name="tokenNetwork" id="tokenNetwork" disabled={false/*data?.transaction?.status.status == 'confirmation' || ((data?.transaction?.status.status == 'completed' || data?.transaction?.status.status == 'error') && data.transaction.type.type == "receive") ? false : true*/} value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                                                    {/* {data?.transaction?.status.status != "confirmation" ? TRANSACTION_STATUS_ENUM?.map(tk => { if ((data?.transaction?.status.status == 'completed' || data?.transaction?.status.status == 'error') && tk != 'confirmation') {console.log("STATUS"); return <option value={tk} selected={true}>{tk}</option>} })
                                                        :
                                                        TRANSACTION_STATUS_ENUM?.map(tk => { return <option value={tk} selected={true}>{tk}</option> })
                                                    } */}
                                                    {TRANSACTION_STATUS_ENUM?.map(tk => { return <option value={tk} selected={true}>{tk}</option> })}
                                                </select>
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletCompleted">Тип</label>
                                                <input type="text" name="walletCompleted" disabled value={data?.transaction?.type.type} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletBalance">Монета</label>
                                                <input type="text" name="walletBalance" value={data?.transaction?.walletAddress?.token.network.symbol + " " + data?.transaction?.walletAddress?.token.symbol} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Hash</label>
                                                <input type="text" name="walletDateCreated" value={data?.transaction?.hash} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Время</label>
                                                <input type="datetime-local" name="walletDateCreated" value={date} onChange={(event) => setDate(event?.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Аддресс</label>
                                                <input type="text" name="walletDateCreated" disabled={data?.transaction?.type.type == 'withdraw' ? false : true} value={addressFrom} onChange={(event) => setAddressFrom(event?.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Скрыта</label>
                                                <input type="checkbox" name="walletDateCreated" checked={hidden} onChange={(event) => setHidden(event?.target.checked)} />
                                            </div>
                                            {/* <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Кому</label>
                                                <input type="text" name="walletDateCreated" value={addressTo} onChange={(event) => setAddressTo(event?.target.value)} />
                                            </div> */}
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Количество</label>
                                                <input type="text" name="walletDateCreated" value={data?.transaction?.amount} disabled />
                                            </div>
                                            {
                                                data?.transaction?.type.type == 'withdraw' && data.transaction.walletAddress.token.symbol == 'TON' ?
                                                    <div className="form-change-input">
                                                        <label htmlFor="walletDateCreated">Memo</label>
                                                        <input type="text" name="walletDateCreated" value={memoInput} onChange={event => setMemoInput(event.target.value)} />
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            <div className="form-change-input">
                                                <button className="swap_percent_btn" disabled={buttonLoading} onClick={changeTransaction}>
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