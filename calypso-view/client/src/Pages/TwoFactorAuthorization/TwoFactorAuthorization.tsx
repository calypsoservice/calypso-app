import React, { ChangeEvent, useEffect, useState } from "react"
import { AuthWrapper } from "../../Components/AuthWrapper"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { SERVER_URL, HEADERS } from "../../constants"



export const EmailConfirmation = () => {
    return (
        <AuthWrapper bottomLink={<EmailConfirmationBottom />} cardHeader={<EmailConfirmationHeader />}>
            <EmailConfirmationForm />
        </AuthWrapper>
    )
}

const EmailConfirmationForm = () => {

    const [digitFirst, setDigitFirst] = useState<string>('')
    const [digitSecond, setDigitSecond] = useState<string>('')
    const [digitThird, setDigitThird] = useState<string>('')
    const [digitFourth, setDigitFourth] = useState<string>('')
    const [formError, setFormError] = useState<string | null>(null)
    const [formStatus, setFormStatus] = useState<0 | 1 | 2>(0)

    const { email } = useParams()
    const navigate = useNavigate()


    const digitFirstChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length == 0) {
            setDigitFirst(event.target.value)
        }
        else {
            setDigitFirst(event.target.value[0]);
            (document.getElementById("digit2-input") as HTMLInputElement).focus();
        }
    }

    const digitSecondChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length == 0) {
            setDigitSecond(event.target.value)
        }
        else {
            setDigitSecond(event.target.value[0]);
            (document.getElementById("digit3-input") as HTMLInputElement).focus();
        }
    }

    const digitThirdChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length == 0) {
            setDigitThird(event.target.value)
        }
        else {
            setDigitThird(event.target.value[0]);
            (document.getElementById("digit4-input") as HTMLInputElement).focus();
        }
    }

    const digitFourthChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length == 0) {
            setDigitFourth(event.target.value)
        }
        else {
            setDigitFourth(event.target.value[0]);
            (document.getElementById("button-confirm") as HTMLInputElement).focus();
        }
    }

    const submitVerificationCode = async () => {
        if (digitFirst.length == 1 && digitFirst.match(/^[0-9]$/) && digitSecond.length == 1 && digitSecond.match(/^[0-9]$/) && digitThird.length == 1 && digitThird.match(/^[0-9]$/) && digitFourth.length == 1 && digitFourth.match(/^[0-9]$/)) {
            setFormStatus(1)
            setFormError(null)
            var data = {
                email: email,
                emailCode: digitFirst + digitSecond + digitThird + digitFourth
            }
            axios.post(SERVER_URL + "/auth/user/verify/status/update", data, {headers: HEADERS})
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
            // setFormError("Invalid code")
            // setFormStatus(2)
        }
    }

    return (
        <React.Fragment>
            <div className="mb-6 text-center">
                <h4 className="text-xl">Verify Your Email</h4>
                <p className="font-light">
                    Please enter the 4 digit code sent to&nbsp;
                    <span className="font-semibold">{email}</span>
                </p>
            </div>
            <form>
                <div className="row">
                    <div className="col-3 col">
                        <div className="mb-3">
                            <label htmlFor="digit1-input" className="visually-hidden">Digit 1</label>
                            <input disabled={formStatus == 1} type="text" className="min-h-10 form-control form-control-lg bg-light border-light text-center" maxLength={1} id="digit1-input" value={digitFirst} onChange={digitFirstChange} />
                        </div>
                    </div>
                    <div className="col-3 col">
                        <div className="mb-3">
                            <label htmlFor="digit2-input" className="visually-hidden">Digit 2</label>
                            <input disabled={formStatus == 1} type="text" className="min-h-10 form-control form-control-lg bg-light border-light text-center" maxLength={1} id="digit2-input" value={digitSecond} onChange={digitSecondChange} />
                        </div>
                    </div>
                    <div className="col-3 col">
                        <div className="mb-3">
                            <label htmlFor="digit3-input" className="visually-hidden">Digit 3</label>
                            <input disabled={formStatus == 1} type="text" className="min-h-10 form-control form-control-lg bg-light border-light text-center" maxLength={1} id="digit3-input" value={digitThird} onChange={digitThirdChange} />
                        </div>
                    </div>
                    <div className="col-3 col">
                        <div className="mb-3">
                            <label htmlFor="digit4-input" className="visually-hidden">Digit 4</label>
                            <input disabled={formStatus == 1} type="text" className="min-h-10 form-control form-control-lg bg-light border-light text-center" maxLength={1} id="digit4-input" value={digitFourth} onChange={digitFourthChange} />
                        </div>
                    </div>
                </div>
            </form>
            {
                formError ?
                    <div className='form-error'>{formError}</div>
                    :
                    <></>
            }
            <div className='mt-6'>
                <button className='btn-success' id="button-confirm" disabled={formStatus == 1} onClick={submitVerificationCode}>
                    {
                        formStatus == 1 ?
                            <div className='loader'></div>
                            :
                            "Verify"
                    }
                </button>
            </div>
        </React.Fragment>
    )
}

const EmailConfirmationBottom = () => {
    const { email } = useParams()
    const [timer, setTimer] = useState<number>(60)

    const resendCode = () => {
        axios.post(SERVER_URL + "/auth/resend/email", { email:  email}, {headers: HEADERS})
            .then(r => console.log(r))
            .catch(e => console.log(e))
        setTimer(60)
    }

    useEffect(() => {
        if (timer == 0) return;
        const intervalId = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(intervalId);
      }, [timer]);

    return (
        <div className='mt-6 text-center'>
            {
                timer == 0 ?
                <p className='mb-0'>
                    Didn't receive a code?&nbsp;
                    <a onClick={resendCode}>Resend</a>
                </p>
                :
                <p className='mb-0'>
                    You can resend code after {timer} seconds.
                </p>
            }
        </div>
    )
}

const EmailConfirmationHeader = () => {
    return (
        <div className="mb-4">
            <div className="avatar-lg mx-auto">
                <div className="avatar-title bg-light display-5 rounded-circle">
                    <i className="ri-mail-line" />
                </div>
            </div>
        </div>
    )
}