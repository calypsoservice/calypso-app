import React, { FC, useContext, useState } from "react"
import { Layout } from "../../Layout/Layout"
import { DashboardContainer } from "../../Components/DashboardContainer"
import { ReferalTextBlock } from "../../Components/ReferalTextBlock"
import { Tooltip } from "@mui/material"
import { AppContext } from "../../Contexts/AppContext"
import { IReferralUser } from "../../Types"
import { Link } from "react-router-dom"




export const Referral: FC = () => {
    const { appContext } = useContext(AppContext)

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const [tooltipTitle, setTooltipTitle] = useState<string>("Copy")
    const [selectedLevel, setSelectedLevel] = useState<number>(1)

    const openTooltip = () => {
        navigator.clipboard.writeText("https://" + window.location.host + "/signup?ref=" + sessionStorage.getItem("username"))
        setTooltipTitle("Copied")
        setTooltipOpen(true)
        setTimeout(() => { setTooltipOpen(false) }, 1500)
    }

    return (
        <React.Fragment>
            <Layout>
                <DashboardContainer title="Referral Program">
                    <div className="referal-text-container">
                        <div className="row">
                            <div className="col-lg-8">
                                <ReferalTextBlock>
                                    <h3>What is referral program?</h3>
                                    <p>The referral program is a great opportunity to share our platform with your friends and followers, and receive bonuses for it! In simple terms, if you invite a new user to our platform, you receive a nice bonus of 5% from your partner’s staking. But if your partner invites a new user using their referral link, then you receive 2% of the staking amount of the invited user and so on.</p>
                                    <p>It is possible to receive rewards for 7 partner levels: First level 5%, second level 3.5%, third level 2%, fourth level 2%, fifth level 1%, sixth level 0.5%, seventh level 0.5%.</p>
                                    <p>Thus, you can increase your income by 8.5% by inviting your friends and followers.</p>
                                </ReferalTextBlock>
                            </div>
                            <div className="col-lg-4">
                                <ReferalTextBlock>
                                    <h3>How to use Referral Program</h3>
                                    <ul>
                                        <li>
                                            <p>Find and copy your referral link, which you can see on this page.</p>
                                        </li>
                                        <li>
                                            <p>Share your referral link with your friends and followers, when a person registers through your link they become your partner.</p>
                                        </li>
                                    </ul>
                                </ReferalTextBlock>
                            </div>
                        </div>
                    </div>
                    <div className="referral-subtitle">Your Referral Link</div>
                    <div className="items-center gap-4 md:gap-0 row">
                        <div className="col-md-8">
                            <div className="referral-link-block" onClick={openTooltip}>
                                <input className="" disabled={true} value={"https://" + window.location.host + "/signup?ref=" + sessionStorage.getItem("username")} />
                                <Tooltip title={tooltipTitle} open={tooltipOpen} placement="top">
                                    <i className="ri-file-copy-fill"></i>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="col-md-4 referral-users">
                            <div className="referral-users-item">
                                <h3>Total Partners</h3>
                                <p>{appContext.user?.totalChildUser != null ? appContext.user?.totalChildUser : 0}</p>
                            </div>
                            <div className="referral-users-item">
                                <h3>Active Partners</h3>
                                <p>{appContext.user?.totalActiveChildUser != null ? appContext.user?.totalActiveChildUser : 0}</p>
                            </div>
                        </div>
                    </div>
                </DashboardContainer>
                <DashboardContainer title="Your Referrals">
                    <div className="referral-levels-row row">
                        <div className={`col-1${selectedLevel == 1 ? ' active' : ''}`} onClick={() => setSelectedLevel(1)}>
                            <p>Level 1</p>
                        </div>
                        <div className={`col-1${selectedLevel == 2 ? ' active' : ''}`} onClick={() => setSelectedLevel(2)}>
                            <p>Level 2</p>
                        </div>
                        <div className={`col-1${selectedLevel == 3 ? ' active' : ''}`} onClick={() => setSelectedLevel(3)}>
                            <p>Level 3</p>
                        </div>
                        <div className={`col-1${selectedLevel == 4 ? ' active' : ''}`} onClick={() => setSelectedLevel(4)}>
                            <p>Level 4</p>
                        </div>
                        <div className={`col-1${selectedLevel == 5 ? ' active' : ''}`} onClick={() => setSelectedLevel(5)}>
                            <p>Level 5</p>
                        </div>
                        <div className={`col-1${selectedLevel == 6 ? ' active' : ''}`} onClick={() => setSelectedLevel(6)}>
                            <p>Level 6</p>
                        </div>
                        <div className={`col-1${selectedLevel == 7 ? ' active' : ''}`} onClick={() => setSelectedLevel(7)}>
                            <p>Level 7</p>
                        </div>
                    </div>
                    <div className="referrals-list-wrapper">
                        {
                            appContext.user ?
                                (appContext.user as any)["childLVL" + selectedLevel].length > 0 ?
                                    <div className="referrals-list">
                                        {(appContext.user as any)["childLVL" + selectedLevel].map((el: IReferralUser) => { return <ReferralListElement data={el} currentLevel={selectedLevel} /> })}
                                    </div>
                                    :
                                    <div className="refferals-list-not-found">
                                        <h3>No Referrals At This Level</h3>
                                    </div>
                                :
                                <></>
                        }
                    </div>
                </DashboardContainer>
            </Layout>
        </React.Fragment>
    )
}

export const ReferralListElement = ({ data, currentLevel }: { data: IReferralUser, currentLevel: number }) => {
    return (
        <div className="referrals-list-element">
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        {data.username}
                        <span className="referral-list-element-titlesub">{currentLevel} level</span>
                    </div>
                    <div className="referral-list-element-subtitle">Username</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        <Link to={`mailto:${data.email}`} target="_blank"><i className="ri-message-2-line"></i></Link>
                    </div>
                    <div className="referral-list-element-subtitle">Contacts</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        ${Number(data.amountStake).toFixed(2)}
                    </div>
                    <div className="referral-list-element-subtitle">Invested</div>
                </div>
            </div>
            <div className="referral-list-col">
                <div className="referral-list-element-wrapper">
                    <div className="referral-list-element-title">
                        ${Number(data.amountParentReward).toFixed(2)}
                    </div>
                    <div className="referral-list-element-subtitle">Commission</div>
                </div>
            </div>
        </div>
    )
} 