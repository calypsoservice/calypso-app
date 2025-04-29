import { useState } from 'react'
import { AuthWrapper } from '../../Components/AuthWrapper'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { SERVER_URL, HEADERS } from '../../constants'



export const Login = () => {

    return (
        <AuthWrapper bottomLink={<LoginBotom />}>
            <LoginForm />
        </AuthWrapper>
    )
}


const LoginForm = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordView, setPasswordView] = useState<boolean>(false)
    const [remember, setRemember] = useState<boolean>(false)
    const [formError, setFormError] = useState<string | undefined>()
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)

    const { block } = useParams()
    console.log(block)

    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const submitLoginForm = async () => {
        setFormStatus(1)
        setFormError(undefined)
        var data = {
            username: username,
            password: password
        }
        axios.post(SERVER_URL + "/auth/signin", data, { headers: HEADERS })
            .then(r => {
                console.log(r)
                if (r.data.verifyEmail == true) {
                    // setFormStatus(2)
                    sessionStorage.setItem("auth-token", r.data.token)
                    sessionStorage.setItem("auth-type", r.data.type)
                    sessionStorage.setItem("username", username)
                    const rid = searchParams.get("rid")
                    if (rid !== null) {
                        navigate(rid)
                    }
                    else {
                        navigate('/dashboard/')
                    }
                }
                else {
                    navigate('/email-confirmation/' + r.data.email)
                }
            })
            .catch(e => {
                console.log(e)
                if (e.status == 400 || e.status == 401) {
                    // setFormError(e.response.data.message)
                    setFormError("Invalid username or password")
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

    return (
        <form>
            {   block ?
                <div className='mb-4'>
                    <div className='account-blocked'>Your account has been blocked!</div>
                </div>
                : <></>
            }
            <div className='mb-4'>
                <label htmlFor="username" className='mb-2 font-medium'>Username</label>
                <input disabled={formStatus == 1} type="text" id='username' className='form-control mt-2' placeholder='Enter username' value={username} onChange={(event) => setUsername(event?.target.value)} onFocus={() => setFormError(undefined)} onBlur={() => setFormError(undefined)} />
            </div>
            <div className='mb-4'>
                <div className='float-right'>
                    <Link to={"/password-reset"} className='password-forgot'>Forgot password?</Link>
                </div>
                <label htmlFor="password-input" className='mb-2 font-medium'>Password</label>
                <div className='relative mt-2 mb-4 auth-pass-inputgroup'>
                    <input disabled={formStatus == 1} type={passwordView ? 'text' : 'password'} className='form-control' id='password-input' placeholder='Enter password' value={password} onChange={(event) => setPassword(event?.target.value)} onFocus={() => setFormError(undefined)} onBlur={() => setFormError(undefined)} />
                    <button type='button' className='hover:border-transparent outline-none password-view focus:outline-none' onClick={() => { setPasswordView(!passwordView) }}>
                        <i className='align-middle ri-eye-fill' />
                    </button>
                </div>
            </div>
            <div className='form-check'>
                <input type="checkbox" disabled={formStatus == 1} id='auth-remember-check' className='form-check-input' checked={remember} onChange={() => { setRemember(!remember) }} />
                <label htmlFor="auth-remember-check" className='form-check-label form-label'>Remember me</label>
            </div>
            {
                formError ?
                    <div className='form-error'>{formError}</div>
                    :
                    <></>
            }
            <div className='mt-6'>
                <button disabled={formStatus == 1} className='btn-success' onClick={submitLoginForm}>
                    {
                        formStatus == 1 ?
                            <div className='loader'></div>
                            :
                            "Sign In"
                    }
                </button>
            </div>
        </form>
    )
}

const LoginBotom = () => {

    return (
        <div className='mt-6 text-center'>
            <p className='mb-0'>
                Don't have an account?&nbsp;
                <Link to={"/signup"} >Signup</Link>
            </p>
        </div>
    )
}