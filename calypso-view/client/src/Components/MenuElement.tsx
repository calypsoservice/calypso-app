import { useLocation, useNavigate } from "react-router-dom"


interface IMenuElement {
    value: {
        title: string,
        path: string,
        icon: JSX.Element
    }
    closeMenu: () => void;
}


export const MenuElement = ({ value, closeMenu }: IMenuElement) => {

    const navigate = useNavigate()
    const currentPath = useLocation()

    console.log(currentPath.pathname.split('/')[1])
    console.log(value.path.split('/')[1])

    return (
        <div className={`menu-element flex gap-2 ml-4 mb-4 ${value.path.split('/')[1] == currentPath.pathname.split('/')[1] ? 'active': value.path.includes('history') && currentPath.pathname.includes('transaction') ? 'active ' : ''}`} onClick={() => {closeMenu(); navigate(value.path)}}>
            <div className="text-xl menu-icon">
                {value.icon}
            </div>
            <div className="text-xl menu-title-wrapper">
                <div className="menu-title">{value.title}</div>
            </div>
        </div>
    )
}
