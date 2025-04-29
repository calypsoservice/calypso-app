import React, { useState } from "react"
import { AuthWrapper } from "../../Components/AuthWrapper"
import { ResetPsswordBottom } from "./ResetPssword"
import { emailCheck } from "../../Hooks/helpers"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../../constants"
import { useNavigate } from "react-router-dom"




export const EmailForPasswordReset = () => {
    return (
        <AuthWrapper bottomLink={<ResetPsswordBottom />} cardHeader={<EmailForPasswordResetHeader />}>
            <EmailForPasswordResetForm />
        </AuthWrapper>
    )
}


const EmailForPasswordResetHeader = () => {
    return (
        <React.Fragment>
            <div className="text-center mt-2 mb-2">
                <h5 className="text-xl">Forgot Password?</h5>
                <p className="font-light text-sm">Reset password with velzon</p>
                <i className="ri-mail-send-line display-5 text-success"></i>
            </div>
            <div className="border-0 alert-warning text-center mb-2 mx-2 alert alert-success fade show" role="alert">
                Enter your email and instructions will be sent to you!
            </div>
        </React.Fragment>
    )
}

const EmailForPasswordResetForm = () => {

    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)

    const navigate = useNavigate()

    const checkEmailFocus = () => {
        setEmailError(null)
    }

    const checkEmailBlur = () => {
        var error: string | null = emailCheck(email)
        setEmailError(error)
    }

    const sendResetLink = () => {
        if (emailCheck(email) == null) {
            setFormStatus(1)
            setFormError(null)
            var data = {
                email: email
            }
            axios.post(SERVER_URL + "/auth/recovery/email/send", data, {headers: HEADERS})
                .then(r => {
                    console.log(r)
                    navigate('/email-confirmation-reset/'+email+'/')
                    // setFormStatus(2)
                })
                .catch(e => {
                    console.log(e)
                    if (e.status == 400) {
                        setFormError(e.response.data.message)
                    }
                    else {
                        console.log(e)
                    }
                    setFormStatus(2)
                })
        }
    }

    return (
        <form>
            <div className='mb-4'>
                <label htmlFor="email" className='mb-2 font-medium'>Email</label>
                <input type="email" id='email' disabled={formStatus == 1} className={`form-control mt-2${emailError != null ? " error" : ''}`} placeholder='Enter email' value={email} onChange={(event) => setEmail(event?.target.value.toLowerCase())} onBlur={checkEmailBlur} onFocus={checkEmailFocus} />
                {
                    emailError != null ?
                        <div className='form-error'>{emailError}</div>
                        :
                        ""
                }
            </div>
            {
                formError ?
                    <div className='form-error'>{formError}</div>
                    :
                    <></>
            }
            <div className='mt-6'>
                <button className='btn-success' type="button" disabled={formStatus == 1} onClick={sendResetLink}>                    
                    {
                        formStatus == 1 ?
                            <div className='loader'></div>
                            :
                            "Send Reset Link"
                    }
                </button>
            </div>
        </form>
    )
}