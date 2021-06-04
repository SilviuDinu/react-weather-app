import { Link } from 'react-router-dom';
import { NAVBAR_MENU } from '../enums/navbar.enum';

export default function Navbar(props: any) {
    return (
      <nav className="nav">
          <Link to="/" className="nav__brand">
            <img src={require(`../media/logo.png`).default} className="nav__logo" alt="logo"/>
          </Link>
          <div className="nav__right">
            <ul className="nav__item-wrapper">
              <li className="nav__item">
                <Link className="nav__link" to="/">{NAVBAR_MENU.HOME}</Link>
              </li>
              <li className="nav__item">
                <Link className="nav__link" to="/about">{NAVBAR_MENU.ABOUT}</Link>
              </li>
            </ul>
          </div>
      </nav>
    );
}
