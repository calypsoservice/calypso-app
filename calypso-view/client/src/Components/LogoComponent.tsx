import { Link } from 'react-router-dom'
import Logoimage from '../assets/images/logo-big2.png'


export const LogoComponent = () => {
    return (
        <div className='px-2 py-4 logo-wrapper'>
            <Link to="/">
                <img src={Logoimage} alt="" />
            </Link>
        </div>
    )
}
