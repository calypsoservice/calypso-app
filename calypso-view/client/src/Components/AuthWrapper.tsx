import React, { FC, PropsWithChildren, ReactNode, useContext, useEffect } from 'react'
import Logoimage from '../assets/images/logo-big2.png'
import PageLoader from '../Pages/PageLoader/PageLoader'
import axios from 'axios'
import { SERVER_URL, HEADERS } from '../constants'
import { AppContext } from '../Contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { logoutHandler } from '../Hooks/helpers'



export const AuthWrapper: FC<PropsWithChildren<{ bottomLink: ReactNode, cardHeader?: ReactNode }>> = ({ children, bottomLink, cardHeader }) => {

    const { appContext, setAppContext } = useContext(AppContext)

    const navigate = useNavigate()
    // const [searchParams] = useSearchParams();

    useEffect(() => {
        const checkJWTToken = async () => {
            const username = sessionStorage.getItem('username')
            if (username) {
                await axios.post(SERVER_URL + '/user/get/username', { username: sessionStorage.getItem("username") }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                    .then(r => {
                        console.log(r.data)
                        if (r.data.blocked == true) {
                            console.log("User blocked")
                            logoutHandler()
                            navigate('/login/blocked/' + `?rid=${location.pathname}`)
                        }
                        else {
                            console.log(r)
                            setAppContext({...appContext, user: r.data})
                            navigate('/dashboard/')
                        }
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
        }
        checkJWTToken()
    }, [])

    return (
        <React.Fragment>
            <PageLoader />
            <div className="pt-5 auth-page-wrapper">
                <div className="auth-one-bg-position auth-one-bg">
                    <div className="bg-overlay"></div>
                    <div className="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
                        </svg>
                    </div>
                    <div className="lg:mt-5 auth-page-content">
                        <div className="login-container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="sm:mt-12 mb-6 text-center text-white-50">
                                        <div className='flex justify-center items-center'>
                                            <img src={Logoimage} alt="" className='h-8 cursor-pointer' onClick={() => navigate('/')} />
                                        </div>
                                        <p className='mt-4 font-medium text-sm'>Premium Invest Platform</p>
                                    </div>
                                </div>
                            </div>
                            <div className='justify-center row'>
                                <div className='col-lg-6 col-md-8 col-xl-5'>
                                    <div className='mt-6 card'>
                                        <div className="p-6 card-body">
                                            {cardHeader ? cardHeader :
                                                <div className="mt-2 text-center">
                                                    <h5 className="">Welcome Back !</h5>
                                                    <p>Sign in to continue to Calypso.</p>
                                                </div>
                                            }
                                            <div className="mt-6 p-2">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                    {bottomLink}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}