import React, { useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { passwordCheck, rePasswordCheck } from "../../Hooks/helpers"




export const Settings = () => {

    const [oldPassword, setOldPassword] = useState<string>()
    const [oldPasswordView, setOldPasswordView] = useState<boolean>(false)
    const [oldPasswordError, /*setOldPasswordError*/] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState<string>()
    const [newPasswordView, setNewPasswordView] = useState<boolean>(false)
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null)
    const [rePassword, setRePassword] = useState<string>()
    const [rePasswordView, setRePasswordView] = useState<boolean>(false)
    const [rePasswordError, setRePasswordError] = useState<string | null>(null)
    const [newPasswordForm, setNewPasswordForm] = useState<0 | 1 | 2 | 3>(0)
    const [newPasswordFormError, setNewPasswordFormError] = useState<string>()

    const [telegram, setTelegram] = useState<string>()
    const [instagram, setInstagram] = useState<string>()
    const [facebook, setFacebook] = useState<string>()

    const checkNewPasswordFocus = () => {
        setNewPasswordError(null)
    }

    const checkNewPasswordBlur = () => {
        var error: string | null = passwordCheck(newPassword)
        if (error) {
            setNewPasswordError(error)
        }
    }

    const checkNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value)
        var error: string | null = passwordCheck(event.target.value)
        setNewPasswordError(error)
        error = rePasswordCheck(event.target.value, rePassword)
        setRePasswordError(error)
    }

    const checkRePasswordFocus = () => {
        setRePasswordError(null)
    }

    const checkRePasswordBlur = () => {
        var error: string | null = rePasswordCheck(newPassword, rePassword)
        setRePasswordError(error)
    }

    const formSubmit = async () => {
        if (oldPassword?.length? oldPassword?.length >= 8 : false || newPasswordError !== null ||  rePasswordError !== null) {
            setNewPasswordForm(1)
            // var data = {
            //     newPassword: newPassword,
            //     oldPassword: oldPassword,
            // }
            await new Promise((r) => setTimeout(r, 2000));
            setNewPasswordFormError("Completed")
            setNewPasswordForm(2)
        }
    }

    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="settings-col">
                            <div className="settings-col-title">Password Settings</div>
                            <div className="settings-col-subtitle">
                                <p>Take a few simple steps to change your password</p>
                            </div>
                            <div className="settings-input-title">Old Password</div>
                            <label className="settings-input-label">
                                <input disabled={newPasswordForm == 1 ? true : false} type={oldPasswordView ? "text" : "password"} placeholder="********" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} />
                                <div className="" onClick={() => setOldPasswordView(!oldPasswordView)}>
                                    {!oldPasswordView ?
                                        <i className="ri-eye-line" />
                                        :
                                        <i className="ri-eye-off-line" />
                                    }
                                </div>
                            </label>
                            {oldPassword && oldPasswordError ?
                                <div className="settings-input-error">{oldPasswordError}</div>
                                :
                                <></>
                            }
                            <div className="settings-input-title">New Password</div>
                            <label className={`settings-input-label${newPasswordError ? " error" : ''}`}>
                                <input disabled={newPasswordForm == 1 ? true : false} type={newPasswordView ? "text" : "password"} placeholder="********" value={newPassword} onChange={checkNewPassword} onFocus={checkNewPasswordFocus} onBlur={checkNewPasswordBlur} />
                                <div className="" onClick={() => setNewPasswordView(!newPasswordView)}>
                                    {!newPasswordView ?
                                        <i className="ri-eye-line" />
                                        :
                                        <i className="ri-eye-off-line" />
                                    }
                                </div>
                            </label>
                            {newPassword && newPasswordError ?
                                <div className="settings-input-error">{newPasswordError}</div>
                                :
                                <></>
                            }
                            <div className="settings-input-title">Re-Type Password</div>
                            <label className={`settings-input-label${rePasswordError ? " error" : ''}`}>
                                <input disabled={newPasswordForm == 1 ? true : false} type={rePasswordView ? "text" : "password"} placeholder="********" value={rePassword} onChange={(event) => setRePassword(event.target.value)} onFocus={checkRePasswordFocus} onBlur={checkRePasswordBlur} />
                                <div className="" onClick={() => setRePasswordView(!rePasswordView)}>
                                    {!rePasswordView ?
                                        <i className="ri-eye-line" />
                                        :
                                        <i className="ri-eye-off-line" />
                                    }
                                </div>
                            </label>
                            {rePassword && rePasswordError ?
                                <div className="settings-input-error">{rePasswordError}</div>
                                :
                                <></>
                            }
                            <button disabled={newPasswordForm == 1 ? true : false} className={`setting-button-submit${newPasswordForm == 1 ? " loading" : ''}`} onClick={formSubmit} >
                                {newPasswordForm == 1 ?
                                    <i className="loader" />
                                    :
                                    "Save"
                                }
                            </button>
                            {newPasswordFormError && (newPasswordForm == 2 || newPasswordForm == 3) ?
                                <div className={`settings-form-status${newPasswordForm == 2 ? " correct" : " error"}`}>{newPasswordFormError}</div>
                                :
                                <></>
                            }
                        </div>
                        <div className="settings-col">
                            <div className="settings-col-title">Social Links</div>
                            <div className="settings-input-title">
                                Telegram&nbsp;
                                <i className="ri-telegram-line" />
                            </div>
                            <label className="settings-input-label">
                                <input type="text" value={telegram} onChange={(event) => setTelegram(event.target.value)} />
                            </label>
                            <div className="settings-input-title">
                                Facebook&nbsp;
                                <i className="ri-facebook-circle-line" />
                            </div>
                            <label className="settings-input-label">
                                <input type="text" value={facebook} onChange={(event) => setFacebook(event.target.value)} />
                            </label>
                            <div className="settings-input-title">
                                Instagram&nbsp;
                                <i className="ri-instagram-line" />
                            </div>
                            <label className="settings-input-label">
                                <input type="text" value={instagram} onChange={(event) => setInstagram(event.target.value)} />
                            </label>
                            <button className="setting-button-submit">
                                Save
                            </button>
                        </div>
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}