import { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { HEADERS, SERVER_URL } from "../constants"
import web3 from "web3"
import { UsersContext } from "../Contexts/AppContext"
import { IUserContext, IWalletContext } from "../Types"

const TRANSACTION_STATUS_ENUM_2 = ["prepared", "confirmation", "completed", "error"]
const TRANSACTION_TYPE_ENUM_2 = ["receive", "withdraw", "bonus", "refBonus"]

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export function createHash() {
    return web3.utils.toHex(makeid(32))
    // return "0x" + createHash('sha256').update(makeid(5)).digest('hex');
}

export const TransactionAddModal = ({ data }: { data?: { modalOpen: boolean, setModalOpen: any } }) => {
    // const [selectedStatus, setSelectedStatus] = useState<string>()
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [selectedStatus, setSelectedStatus] = useState<string>('prepared')
    const [selectedType, setSelectedType] = useState<string>('stake')
    const { usersContext, setUsersContext } = useContext(UsersContext)
    const { id } = useParams()

    const [selectedUser, setSelectedUser] = useState<IUserContext>()
    const [address, setAddress] = useState<string>('')
    // const [addressTo, setAddressTo] = useState<string>('')
    const [selectedToken, setSelectedToken] = useState<IWalletContext>()
    const [hash, setHash] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    // const [gasAmount, setGasAmount] = useState<string>('')
    const [memo, setMemo] = useState<string>('')

    const [date2, setDate2] = useState<any>()

    useEffect(() => {
        usersContext?.forEach((us) => {
            if (us.id == Number(id)) {
                setSelectedUser(us)
                setSelectedToken(us.userWallet.walletAddresses[0])
            }
        })
    }, [])

    useEffect(() => {
        usersContext?.forEach((us) => {
            if (us.id == Number(id)) {
                setSelectedUser(us)
                setSelectedToken(us.userWallet.walletAddresses[0])
            }
        })
    }, [usersContext])

    useEffect(() => {
        console.log("DATE 2")
        console.log(date2)
        console.log(typeof (date2))
    }, [date2])

    const addReceiveTransaction = () => {
        if (amount === undefined || amount == "") return;
        if (date2 === undefined || date2 == "") return;
        var dt: any = {
            "hash": createHash(),
            "walletAddressId": selectedToken?.id,
            "amount": amount,
            "status": selectedStatus,
            "type": selectedType,
            dateCreated: date2,
            userId: selectedUser?.id,
        }
        if (selectedType == 'withdraw') {
            if (address === undefined || address == "") return
            dt = { ...dt, receiveAddress: address }
            if (selectedToken?.token.symbol == 'TON') {
                dt = { ...dt, memo: memo }
            }
        }
        else if (selectedType == 'receive') {
            if (hash === undefined || hash == "") return
            dt = { ...dt, receiveHash: hash }
        }
        axios.post(SERVER_URL + '/admin/transaction/save', dt, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
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
                    })
            })
            .catch((error) => {
                console.log(error)
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
                            <div className="bg-backgroundPrimary shadow-xl px-4 py-4 rounded-lg w-full max-w-md overflow-hidden text-left align-middle transition-all transform">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-textPrimary text-unset header-text">Добавить транзакию</h3>
                                    </div>
                                    <div>
                                        <div className="flex w-full">
                                            <button type="button" className="bg-transparent p-0 outline-none w-full text-backgroundPrimary default-button" onClick={() => { data?.setModalOpen(false); }}>
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
                                                <label htmlFor="walletSeed">Статус</label>
                                                <select name="tokenNetwork" id="tokenNetwork" disabled={false} value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                                                    {TRANSACTION_STATUS_ENUM_2?.map(tk => { return <option value={tk} selected={true}>{tk}</option> })}
                                                </select>
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletCompleted">Тип</label>
                                                <select name="tokenNetwork" id="tokenNetwork" disabled={false} value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                                                    {TRANSACTION_TYPE_ENUM_2?.map(tk => { return <option value={tk} selected={true}>{tk}</option> })}
                                                </select>
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletBalance">Монета</label>
                                                <select name="tokenNetwork" id="tokenNetwork" value={Number(selectedToken?.id)} onChange={(event) => selectedUser?.userWallet.walletAddresses.forEach(tk => { if (tk.id == Number(event.target.value)) { setSelectedToken(tk) } })}>
                                                    {selectedUser?.userWallet.walletAddresses?.map((tk) => { return <option value={tk.id} selected={true}>{tk.token.network.name + " (" + tk.token.name + ")"}</option> })}
                                                </select>
                                            </div>
                                            <div>
                                                <div className="form-change-input">
                                                    <label htmlFor="walletDateCreated">Дата</label>
                                                    <input type="datetime-local" name="walletDateCreated" value={date2} onChange={(event) => setDate2(event.target.value)} />
                                                </div>
                                            </div>
                                            {
                                                selectedType == 'withdraw' ?
                                                    <>
                                                        <div className="form-change-input">
                                                            <label htmlFor="walletDateCreated">Аддресс</label>
                                                            <input type="text" name="walletDateCreated" value={address} onChange={(event) => setAddress(event.target.value)} />
                                                        </div>
                                                        {
                                                            selectedToken?.token.symbol == 'TON' ?

                                                                <div className="form-change-input">
                                                                    <label htmlFor="walletDateCreated">Memo</label>
                                                                    <input type="text" name="walletDateCreated" value={memo} onChange={(event) => setMemo(event?.target.value)} />
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            {
                                                selectedType == 'receive' ?
                                                    <>
                                                        <div className="form-change-input">
                                                            <label htmlFor="walletDateCreated">Hash</label>
                                                            <input type="text" name="walletDateCreated" value={hash} onChange={(event) => setHash(event.target.value)} />
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Количество</label>
                                                <input type="text" name="walletDateCreated" value={amount} onChange={(event) => setAmount(event?.target.value)} />
                                            </div>
                                            {/* <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Комиссия</label>
                                                <input type="text" name="walletDateCreated" value={gasAmount} onChange={(event) => setGasAmount(event?.target.value)} />
                                            </div>
                                            <div className="form-change-input">
                                                <label htmlFor="walletDateCreated">Memo</label>
                                                <input type="text" name="walletDateCreated" value={memo} onChange={(event) => setMemo(event?.target.value)} />
                                            </div> */}
                                            <div className="form-change-input">
                                                <button className="swap_percent_btn" disabled={buttonLoading} onClick={addReceiveTransaction}>
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