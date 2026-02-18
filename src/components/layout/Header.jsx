import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/Authorisatisdfa";
import { logoutUser } from "../../firebase/auth";

const Header = () => {
  const { user } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/diagnostics", label: "Diagnostics" },
    { to: "/practice", label: "Practice" },
    { to: "/progress", label: "Progress" },
    { to: "/results", label: "Results" },
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">Axioma</div>
        <nav className="header-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="header-right">
        <span className="header-user">
          <strong>{user?.displayName || "Student"}</strong>
        </span>
        <button className="header-logout" onClick={logoutUser}>
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;