import { useEffect } from "react"
import { logoutHandler } from "../../Hooks/helpers"
import PageLoader from "../PageLoader/PageLoader"
import { useNavigate } from "react-router-dom"



export const Logout = () => {

    const navigate = useNavigate()
    
    useEffect(() => {
        logoutHandler()
        navigate('/login/')
    }, [])
    return (
        <PageLoader />
    )
} 