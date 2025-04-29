import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../constants";
import { UsersContext } from "../Contexts/AppContext";
import { IWalletContext } from "../Types";
import { logoutHandler } from "../Hooks/helpers";
import { useNavigate } from "react-router-dom";



export const TokenChangeModal = ({ data }: { data?: {modalOpen?: boolean, setModalOpen?: any, token?: IWalletContext, setToken?: any} }) => {

    const [balance, setBalance] = useState<string>()
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const { setUsersContext } = useContext(UsersContext)

    useEffect(() => {
        setBalance(data?.token?.balance ? String(data?.token?.balance) : "0")
    }, [])

    useEffect(() => {
        setBalance(data?.token?.balance ? String(data?.token?.balance) : "0")
    }, [data?.token])

    const navigate = useNavigate()

    const changeWallet = () => {
        setButtonLoading(true)
        var dt = {
            id: data?.token?.id,
            balance: balance
        }
        axios.post(SERVER_URL + '/admin/address/update', dt, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
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
                                        <h3 className="font-semibold text-textPrimary text-unset header-text">Изменить токен</h3>
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
                                                <label htmlFor="walletName">Сеть</label>
                                                <input type="text" name="walletName" value={data?.token?.token?.network.name} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Название</label>
                                                <textarea name="walletSeed" value={data?.token?.token?.symbol} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletBalance">Баланс</label>
                                                <input type="text" name="walletBalance" value={balance} onChange={(event) => setBalance(event.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Адресс</label>
                                                <input type="text" name="walletDateCreated" value={data?.token?.address} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <button className="swap_percent_btn" disabled={buttonLoading} onClick={changeWallet}>
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
