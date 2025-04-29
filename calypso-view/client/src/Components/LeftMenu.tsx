import React, { FC } from "react"
import { LogoComponent } from "./LogoComponent"
import { MenuElement } from "./MenuElement"


const menuData = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <i className="ri-trello-line"></i>,
    },
    {
        title: 'Deposit',
        path: '/deposit',
        icon: <i className="ri-briefcase-4-line"></i>,
    },
    {
        title: 'Add funds',
        path: '/cashin',
        icon: <i className="ri-bit-coin-line"></i>,
    },
    // {
    //     title: 'Support',
    //     path: '/support',
    //     icon: <i className="ri-contacts-line"></i>,
    // },
    {
        title: 'Deposits',
        path: '/deposits',
        icon: <i className="ri-numbers-line"></i>,
    },
    {
        title: 'Referrals',
        path: '/referrals',
        icon: <i className="ri-hand-coin-line"></i>,
    },
    {
        title: 'History',
        path: '/history',
        icon: <i className="ri-newspaper-line"></i>,
    },
    // {
    //     title: 'Settings',
    //     path: '/settings',
    //     icon: <i className="ri-settings-3-line"></i>,
    // },
    {
        title: "Logout",
        path: "/logout",
        icon: <i className="ri-logout-box-line"></i>
    }
]

export const LeftMenu: FC<{ open: React.Dispatch<React.SetStateAction<boolean>>, isOpen: boolean }> = ({ open, isOpen }) => {



    return (
        <div className={`left-menu px-4${isOpen ? '' : ' closed'}`}>
            <div className="flex justify-center items-center gap-2 mb-4">
                <LogoComponent />
                <i className="block md:hidden text-2xl ri-close-line" onClick={() => open(!isOpen)} />
            </div>
            {menuData.map(e => {
                return <MenuElement value={e} closeMenu={() => open(false)} />
            })}
        </div>
    )
}