import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../constants";
import { numberToUsdFormat } from "./UsersPage";
import { IUserContext, IWalletContext } from "../Types";
import { UsersContext } from "../Contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { logoutHandler } from "../Hooks/helpers";



export const WalletChangeModal = ({ data }: { data: {modalOpen: boolean, setModalOpen: any, user?: IUserContext, setUser: any} }) => {

    const [balance, setBalance] = useState<string>()
    // const [completed, setCompleted] = useState<boolean>()
    const [active, setActive] = useState<boolean>(!data.user?.blocked)
    const [description, setDescription] = useState<string>(data.user?.userData.description == null ? '' : data.user.userData.description)
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const { setUsersContext } = useContext(UsersContext)

    useEffect(() => {
        var balance = 0
        setButtonLoading(false)
        data?.user?.userWallet.walletAddresses?.forEach((tk: IWalletContext) => {
            balance += Number(numberToUsdFormat(tk.balance, tk.token.price))
        })
        setBalance(String(balance))
        // setCompleted(data?.user?.completed)
        // setActive(data?.user?.active)
        // setDescription(data?.user?.description)
    }, [])

    useEffect(() => {
        var balance = 0
        data?.user?.userWallet.walletAddresses?.forEach((tk: IWalletContext) => {
            balance += Number(numberToUsdFormat(tk.balance, tk.token.price))
        })
        setBalance(String(balance))
        setDescription(data.user?.userData.description == null ? '' : data.user.userData.description)
        setActive(!data.user?.blocked)
        // setCompleted(data?.user?.completed)
        // setActive(data?.user?.active)
        // setDescription(data?.user?.description)
    }, [data.user])
    
    const { id } = useParams()

    const navigate = useNavigate()

    const changeWallet = () => {
        setButtonLoading(true)
        var dt = {
            id: data.user?.id,
            blocked: !active,
            description: description,
        }
        axios.post(SERVER_URL + '/admin/user/update', dt, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
                axios.post(SERVER_URL + '/admin/user/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                    .then((response) => {
                        setUsersContext(response.data)
                        data.setUser(response.data)
                        response.data?.forEach((us: IUserContext) => {
                            if (Number(id) == us.id) {
                                console.log("SET USER")
                                data.setUser(us)
                            }
                        })
                        data.setModalOpen(false)
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
                                        <h3 className="font-semibold text-textPrimary text-unset header-text">Изменить кошельёк</h3>
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
                                                <input type="text" name="walletName" value={data?.user?.id} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletSeed">Seed</label>
                                                <textarea name="walletSeed" value={data?.user?.userData.mnemonic} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletBalance">Баланс</label>
                                                <input type="text" name="walletBalance" value={balance} disabled />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletActive">Активный?</label>
                                                <input type="checkbox" name="walletActive" checked={active} onChange={() => setActive(!active)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDescription">Описание</label>
                                                <textarea name="walletDescription" value={description} onChange={(event) => setDescription(event?.target.value)} />
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