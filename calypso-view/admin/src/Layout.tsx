import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { HEADERS, SERVER_URL } from "./constants"
// import { ChatContext } from "./Contexts/AppContext"
// import { error } from "console"
import { UsersContext } from "./Contexts/AppContext"
import { ChatBlock } from "./Components/ChatComponent"
import PageLoader from "./Pages/PageLoader/PageLoader"
import { logoutHandler } from "./Hooks/helpers"



export const Layout = () => {

    const [update, setUpdate] = useState<number>(0)

    const { setUsersContext } = useContext(UsersContext)
    // const { tokensContext, setTokensContext } = useContext(TokensContext)
    // const { stakesContext, setStakesContext } = useContext(StakesContext)
    // const { chatContext, setChatContext } = useContext(ChatContext)


    useEffect(() => {
        const getAllWallets = async () => {
            axios.post(SERVER_URL + '/admin/user/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then((response) => {
                    var data = response.data
                    console.log(data)
                    setUsersContext(response.data)
                    setUpdate(update+1)
                })
                .catch((error) => {
                    console.log(error)
                    if (error.status == 401 || error.code == "ERR_NETWORK") {
                        console.log("Invalid Token")
                        logoutHandler()
                        navigate('/login/')
                    }
                })
            try {
                var user = await axios.post(SERVER_URL + '/user/get/username', { username: sessionStorage.getItem("username") }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                user = user.data
                console.log(user)
            }
            catch (error) {
                console.log(error)
                // if (user.status == 401 || user.request.code == "ERR_NETWORK") {
                console.log("Invalid Token")
                // logoutHandler()
                // navigate('/login/' + `?rid=${location.pathname}`)
                // }

            }
        }
        getAllWallets()
        // getProgramData()
        // getAllTokenInfo()
        // getAllStakings()
        // getAllNetworks()
    }, [])

    // useEffect(() => {
    //     const getAllWallets = async () => {
    //         axios.post(SERVER_URL + '/admin/user/get/all', {}, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
    //             .then((response) => {
    //                 var data = response.data
    //                 console.log(data)
    //                 setUsersContext(response.data)
    //                 setUpdate(update+1)
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //                 if (error.status == 401 || error.code == "ERR_NETWORK") {
    //                     console.log("Invalid Token")
    //                     logoutHandler()
    //                     navigate('/login/')
    //                 }
    //             })
    //         try {
    //             var user = await axios.post(SERVER_URL + '/user/get/username', { username: sessionStorage.getItem("username") }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
    //             user = user.data
    //             console.log(user)
    //         }
    //         catch (error) {
    //             console.log(error)
    //             // if (user.status == 401 || user.request.code == "ERR_NETWORK") {
    //             console.log("Invalid Token")
    //             // logoutHandler()
    //             // navigate('/login/' + `?rid=${location.pathname}`)
    //             // }

    //         }
    //     }
    //     const intervalId = setInterval(getAllWallets, 5000)
    //     return () => clearInterval(intervalId);
    // }, [update])

    const navigate = useNavigate()

    const logoutUser = () => {
        deleteToken()
        navigate('/login/')
    }

    function deleteToken() {
        sessionStorage.clear()
    }

    return (
        <div className="App">
            <PageLoader />
            <div className="compact-wrapper null page-wrapper">
                <div className="page-body-wrapper">
                    <div className="page-body">
                        <div className="d-flex">
                            <div className="horizontal-logo navbar-brand-box">
                                <div>
                                    <button style={{
                                        padding: "4px",
                                        fontSize: "14px",
                                        border: "1px solid #333333",
                                        borderRadius: "4px"
                                    }} onClick={logoutUser}>Logout</button>
                                </div>
                            </div>
                        </div>
                        <Outlet />
                    </div>
                </div>
            </div>
            <ChatBlock />
        </div>
    )
}