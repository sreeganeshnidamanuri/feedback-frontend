import { NavLink } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <FiMessageSquare size={20} />
          Feedback<span>Hub</span>
        </NavLink>
        <ul className="navbar__links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
