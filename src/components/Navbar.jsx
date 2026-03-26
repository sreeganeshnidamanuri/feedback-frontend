import { NavLink, useNavigate } from "react-router-dom";
import { FiMessageSquare, FiLogIn, FiLogOut } from "react-icons/fi";
import authService from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const token = authService.getToken();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <FiMessageSquare size={20} />
          Feedback<span>Hub</span>
        </NavLink>

        {/* Links */}
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>

          {/* Show Admin ONLY if logged in */}
          {token && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
                Admin
              </NavLink>
            </li>
          )}

          {/* Login / Logout */}
          <li>
            {token ? (
              <button className="nav-btn logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            ) : (
              <NavLink to="/login" className="nav-btn login">
                <FiLogIn /> Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}