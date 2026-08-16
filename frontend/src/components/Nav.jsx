import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="nav-logo">Polyaymen</NavLink>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Work</NavLink></li>
          <li><NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>About</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}
