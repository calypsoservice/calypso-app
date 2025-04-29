import { useEffect, useState } from "react"
import { AuthWrapper } from "../../Components/AuthWrapper"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { emailCheck, passwordCheck, rePasswordCheck, usernameCheck } from "../../Hooks/helpers"
import axios from 'axios'
import { HEADERS, SERVER_URL } from "../../constants"
import TermsOfUse from '../../assets/Terms Of Use.pdf'


export const Registration = () => {

    return (
        <AuthWrapper bottomLink={<SignUpBottom />}>
            <SignUpForm />
        </AuthWrapper>
    )
}


const SignUpForm = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState<string>('')
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
    const [referral, setReferral] = useState<string>('')
    const [referralError, /*setReferralError*/] = useState<string | null>(null)
    const [passwordView, setPasswordView] = useState<boolean>(false)
    const [passwordView2, setPasswordView2] = useState<boolean>(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)
    const [agreeTU, setAgreeTU] = useState<boolean>(false)
    const [agreeTUError, setAgreeTUError] = useState<0 | 1>(0)

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref")
        if (ref !== null) {
            setReferral(ref)
        }
    }, [])

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

    const checkEmailFocus = () => {
        setEmailError(null)
    }

    const checkEmailBlur = () => {
        var error: string | null = emailCheck(email)
        setEmailError(error)
    }

    const checkUsernameFocus = () => {
        setUsernameError(null)
    }

    const checkUsernameBlur = () => {
        var error: string | null = usernameCheck(username)
        console.log("ERROR: " + error)
        setUsernameError(error)
    }

    const submitSignupForm = async () => {
        checkUsernameBlur()
        checkEmailBlur()
        checkRePasswordBlur()
        checkPasswordBlur()
        if (agreeTU == false) { setAgreeTUError(1); return }
        if (passwordCheck(password) == null && rePasswordCheck(password, confirmPassword) == null && usernameCheck(username) == null && emailCheck(email) == null) {
            setFormStatus(1)
            setFormError(null)
            var data = {
                username: username,
                password: password,
                email: email,
                refValue: referral
            }
            axios.post(SERVER_URL + "/auth/signup", data, {headers: HEADERS})
                .then(r => {
                    console.log(r)
                    navigate('/email-confirmation/'+email+'/')
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
        else {
            console.log("FORM NOT VALID")
        }
    }

    return (
        <form>
            <div className='mb-4'>
                <label htmlFor="username" className='mb-2 font-medium'>Username</label>
                <input type="text" id='username' disabled={formStatus == 1} className={`form-control mt-2${usernameError != null ? " error" : ''}`} placeholder='Enter username' value={username} onChange={(event) => setUsername(event?.target.value.replace(" ", ""))} onFocus={checkUsernameFocus} onBlur={checkUsernameBlur} />
                {
                    usernameError != null ?
                        <div className='form-error'>{usernameError}</div>
                        :
                        ""
                }
            </div>
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
            <div className='mb-4'>
                <label htmlFor="password-input" className='mb-2 font-medium'>Password</label>
                <div className='auth-pass-inputgroup relative mt-2 mb-4'>
                    <input type={passwordView ? 'text' : 'password'} disabled={formStatus == 1} className={`form-control${passwordError != null ? " error" : ''}`} id='password-input' placeholder='Enter password' value={password} onChange={checkNewPassword} onBlur={checkPasswordBlur} onFocus={checkPasswordFocus} />
                    <button type='button' className='hover:border-transparent outline-none focus:outline-none password-view' onClick={() => { setPasswordView(!passwordView) }}>
                        <i className='align-middle ri-eye-fill' />
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
                <div className='auth-pass-inputgroup relative mt-2 mb-4'>
                    <input type={passwordView2 ? 'text' : 'password'} disabled={formStatus == 1} className={`form-control${confirmPasswordError != null ? " error" : ''}`} id='password-input2' placeholder='Enter password again' value={confirmPassword} onChange={(event) => setConfirmPassword(event?.target.value)} onBlur={checkRePasswordBlur} onFocus={checkRePasswordFocus} />
                    <button type='button' className='hover:border-transparent outline-none focus:outline-none password-view' onClick={() => { setPasswordView2(!passwordView2) }}>
                        <i className='align-middle ri-eye-fill' />
                    </button>
                </div>
                {
                    confirmPasswordError != null ?
                        <div className='form-error'>{confirmPasswordError}</div>
                        :
                        ""
                }
            </div>
            <div className='mb-4'>
                <label htmlFor="referral" className='mb-2 font-medium'>Referral</label>
                <input type="text" id='referral' disabled={true} className={`form-control mt-2${referralError != null ? " error" : ''}`} placeholder='You have not referral link' value={referral} onChange={(event) => setReferral(event?.target.value)} />
                {
                    referralError != null ?
                        <div className='form-error'>{referralError}</div>
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
            <div className={`form-check${agreeTUError == 1 ? ' check-error' : ''}`}>
                <input type="checkbox" disabled={formStatus == 1} id='auth-remember-check' className='form-check-input' checked={agreeTU} onChange={() => { setAgreeTUError(0); setAgreeTU(!agreeTU) }} />
                <label htmlFor="auth-remember-check" className='form-check-label form-label'>I agree with <a target="_blank" href={TermsOfUse} className="text-main">Terms of Service</a></label>
            </div>
            <div className='mt-6'>
                <button className='btn-success' type="button" disabled={formStatus == 1} onClick={submitSignupForm}>
                    {
                        formStatus == 1 ?
                            <div className='loader'></div>
                            :
                            "Sign Up"
                    }
                </button>
            </div>
        </form>
    )
}

const SignUpBottom = () => {
    return (
        <div className='mt-6 text-center'>
            <p className='mb-0'>
                Have an account?&nbsp;
                <Link to={"/login"}>Signin</Link>
            </p>
        </div>
    )
}