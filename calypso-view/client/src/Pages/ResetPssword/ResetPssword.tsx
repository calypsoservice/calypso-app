import { useState } from "react"
import { AuthWrapper } from "../../Components/AuthWrapper"
import { passwordCheck, rePasswordCheck } from "../../Hooks/helpers"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../../constants"





export const ResetPssword = () => {
    return (
        <AuthWrapper bottomLink={<ResetPsswordBottom />} cardHeader={<ResetPsswordHeader />}>
            <ResetPsswordForm />
        </AuthWrapper>
    )
}


export const ResetPsswordBottom = () => {
    return (
        <div className='mt-6 text-center'>
            <p className='mb-0'>
                Wait, I remember my password...&nbsp;
                <Link to={"/login"}>Click here</Link>
            </p>
        </div>
    )
}


const ResetPsswordHeader = () => {
    return (
        <div className="text-center mt-2">
            <h5 className="text-xl">Create new password</h5>
            <p className="font-light text-sm">Your new password must be different from previous used password.</p>
        </div>
    )
}

const ResetPsswordForm = () => {

    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [confirmPassword, setConfirmPPassword] = useState<string>('')
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
    const [passwordView, setPasswordView] = useState<boolean>(false)
    const [passwordView2, setPasswordView2] = useState<boolean>(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)

    const { email } = useParams()
    const navigate = useNavigate()

    const checkPasswordFocus = () => {
        setPasswordError(null)
    }

    const checkPasswordBlur = () => {
        var error: string | null = passwordCheck(password)
        if (error) {
            setPasswordError(error)
        }
    }

    const checkNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
        var error: string | null = passwordCheck(event.target.value)
        setPasswordError(error)
        error = rePasswordCheck(event.target.value, confirmPassword)
        setConfirmPasswordError(error)
    }

    const checkRePasswordFocus = () => {
        setConfirmPasswordError(null)
    }

    const checkRePasswordBlur = () => {
        var error: string | null = rePasswordCheck(password, confirmPassword)
        setConfirmPasswordError(error)
    }

    const confirmRestorePassword = async () => {
        if (passwordCheck(password) == null && rePasswordCheck(password, confirmPassword) == null) {
            setFormStatus(1)
            setFormError(null)
            var data = {
                password: password,
                email: email,
            }
            axios.post(SERVER_URL + "/auth/recovery/password/update", data, {headers: HEADERS})
                .then(r => {
                    console.log(r)
                    navigate('/login/')
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
            // await new Promise((r) => setTimeout(r, 2000));
            // setFormError("Invalid password")
            // setFormStatus(2)
        }
    }


    return (
        <form>
            <div className='mb-4'>
                <label htmlFor="password-input" className='mb-2 font-medium'>Password</label>
                <div className='relative mb-4 mt-2 auth-pass-inputgroup'>
                    <input type={passwordView ? 'text' : 'password'} disabled={formStatus == 1} className='form-control' id='password-input' placeholder='Enter password' value={password} onChange={checkNewPassword} onFocus={checkPasswordFocus} onBlur={checkPasswordBlur} />
                    <button type='button' className='password-view outline-none hover:border-transparent focus:outline-none' onClick={() => { setPasswordView(!passwordView) }}>
                        <i className='ri-eye-fill align-middle' />
                    </button>
                </div>
                {
                    passwordError != null ?
                        <div className='form-error'>{passwordError}</div>
                        :
                        ""
                }
            </div>
            <div className='mb-4'>
                <label htmlFor="password-input2" className='mb-2 font-medium'>Password Again</label>
                <div className='relative mb-4 mt-2 auth-pass-inputgroup'>
                    <input type={passwordView2 ? 'text' : 'password'} disabled={formStatus == 1} className='form-control' id='password-input2' placeholder='Enter password again' value={confirmPassword} onChange={(event) => setConfirmPPassword(event?.target.value)} onFocus={checkRePasswordFocus} onBlur={checkRePasswordBlur} />
                    <button type='button' className='password-view outline-none hover:border-transparent focus:outline-none' onClick={() => { setPasswordView2(!passwordView2) }}>
                        <i className='ri-eye-fill align-middle' />
                    </button>
                </div>
                {
                    confirmPasswordError != null ?
                        <div className='form-error'>{confirmPasswordError}</div>
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
                <button className='btn-success' disabled={formStatus == 1} onClick={confirmRestorePassword}>
                    {
                        formStatus == 1 ?
                            <div className='loader'></div>
                            :
                            "Reset Password"
                    }
                </button>
            </div>
        </form>
    )
}
