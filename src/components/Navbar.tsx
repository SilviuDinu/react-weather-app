import { Link } from "react-router-dom";
import { MISC } from "@enums/misc.enum";
import { NAVBAR_MENU } from "@enums/navbar.enum";

export default function Navbar(props: any) {
  return (
    <nav className="nav">
      <Link to="/" className="nav__brand">
        <img
          src={require(`@media/images/logo.png`).default}
          className="nav__logo"
          alt="logo"
        />
      </Link>
      <div className="nav__right">
        <ul className="nav__item-wrapper">
          <li className="nav__item">
            <Link className="nav__link" to="/">
              {NAVBAR_MENU.HOME}
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__link" to="/about">
              {NAVBAR_MENU.ABOUT}
            </Link>
          </li>
          <li className="nav__item">
            <a
              target="_blank"
              rel="noreferrer"
              className="nav__link"
              href={MISC.GITHUB_URL}
            >
              <img
                src={require(`@media/images/github-light.png`).default}
                className="nav__logo github"
                alt="github"
              />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
