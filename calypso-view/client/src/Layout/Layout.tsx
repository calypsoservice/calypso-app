import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { LeftMenu } from "../Components/LeftMenu";
import PageLoader from "../Pages/PageLoader/PageLoader";
// import { IAppContext } from "../Types";
import { AppContext } from "../Contexts/AppContext";
import axios from "axios";
import { HEADERS, SERVER_URL } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutHandler } from "../Hooks/helpers";
import { ChatBlock } from "../Components/ChatComponent";



export const Layout: FC<PropsWithChildren> = ({ children }) => {

    const [leftMenuOpen, setLeftMenuOpen] = useState<boolean>(window.innerWidth < 768 ? false : true)
    const [totalBalance, setTotalBalance] = useState<string>()
    const [totalDeposite, setTotalDeposite] = useState<string>()
    // const [chatOpen, setChatOpen] = useState<boolean>(false)
    const { appContext, setAppContext } = useContext(AppContext)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const getUserData = async () => {
            var user: any
            try {
                user = await axios.post(SERVER_URL + '/user/get/username', { username: sessionStorage.getItem("username") }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                user = user.data
                console.log(user)
                if (user.blocked == true) {
                    console.log("User blocked")
                    logoutHandler()
                    navigate('/login/blocked/' + `?rid=${location.pathname}`)
                    return
                }
            }
            catch (error) {
                console.log(error)
                // if (user.status == 401 || user.request.code == "ERR_NETWORK") {
                console.log("Invalid Token")
                logoutHandler()
                navigate('/login/' + `?rid=${location.pathname}`)
                // }

            }
            var tokens: any
            try {
                tokens = await axios.post(SERVER_URL + '/token/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                tokens = tokens.data
            }
            catch (error) {
                console.log(error)
                console.log("Invalid Token")
                logoutHandler()
                navigate('/login/' + `?rid=${location.pathname}`)

            }
            var stakes: any
            try {
                stakes = await axios.post(SERVER_URL + '/stake/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                stakes = stakes.data
            }
            catch (error) {
                console.log(error)
                console.log("Invalid Token")
                logoutHandler()
                navigate('/login/' + `?rid=${location.pathname}`)

            }
            if (tokens && user && stakes) {
                console.log({ user: (user as any), tokens: (tokens as any), stakes: (stakes as any) })
                setAppContext({ user: (user as any), tokens: (tokens as any), stakes: (stakes as any) })
            }
        }

        getUserData()
    }, [])

    useEffect(() => {
        var tBalance = 0
        var tDeposite = 0
        appContext.user?.userWallet?.walletAddresses?.forEach(wa => {
            tBalance += Number(wa.balance) * Number(wa.token.price)
        })
        appContext.user?.userStakes.forEach(us => {
            if (us.closed !== true) {
                tDeposite += Number(us.amount) * Number(us.token.price)
            }
        })
        setTotalDeposite(tDeposite.toFixed(2))
        setTotalBalance(tBalance.toFixed(2))
    }, [appContext.user])

    return (
        <div className="layout">
            <PageLoader />
            <LeftMenu open={setLeftMenuOpen} isOpen={leftMenuOpen} />
            <div className="main-container">
                <div className="data-container">
                    <div className="user-data-container-bg"></div>
                    <div className="relative flex px-2 py-2 user-data-container">
                        <div className="open-menu-wrapper" onClick={() => setLeftMenuOpen(!leftMenuOpen)}>
                            <i className="ri-bar-chart-horizontal-line"></i>
                        </div>
                        <div className="gap-2 blance-data">
                            <div className="wallet-balance-data">
                                <div className="wallet-balance-title">Wallet Balance:</div>
                                <div className="flex flex-row justify-start items-center gap-1 text-2xl wallet-balance">
                                    <i className="text-xl ri-money-dollar-circle-line"></i>
                                    {totalBalance}
                                </div>
                            </div>
                            <div className="wallet-balance-data">
                                <div className="wallet-balance-title">Deposit Balance:</div>
                                <div className="text-green-1000 wallet-balance">{totalDeposite}$</div>
                            </div>
                        </div>
                        <div className="staking-start">
                            <div className="flex flex-row flex-wrap justify-start items-center gap-4 staking-start-wrapper">
                                <button className="flex flex-row flex-grow gap-2 px-4 py-2 staking-start-button" onClick={() => navigate('/cashin/')}>
                                    <i className="ri-arrow-right-down-fill text-xl"></i>
                                    Add Funds
                                </button>
                                <button className="flex flex-row flex-grow gap-2 px-4 py-2 staking-start-button" onClick={() => navigate('/deposit/')}>
                                    <i className="ri-arrow-right-down-fill text-xl"></i>
                                    Open deposit
                                </button>
                                <button className="flex flex-row flex-grow gap-2 px-4 py-2 staking-start-button" onClick={() => navigate('/cashout/')}>
                                    <i className="ri-arrow-right-up-fill text-xl"></i>
                                    Withdraw Funds
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
            <ChatBlock />
        </div>
    )
}
