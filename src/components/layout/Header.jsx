import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { logoutUser } from "../../firebase/auth";

const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
      <>
        <line x1="4" y1="7"  x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </>
    )}
  </svg>
);

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1"  x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1"  y1="12" x2="3"  y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Header = ({ sidebarOpen, onToggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="header">
      <div className="header__left">
        <button
          className={`header__menu-btn ${sidebarOpen ? "header__menu-btn--open" : ""}`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon open={sidebarOpen} />
        </button>

        <Link to="/home" className="header__brand">
          <div className="header__logo-wrap">
            <div className="header__logo-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <span className="header__brand-name">Axioma</span>
        </Link>
      </div>

      <nav className="header__nav">
        <Link to="/home" className="header__nav-link">Home</Link>
        <Link to="/diagnostics" className="header__nav-link">Diagnostics</Link>
        <Link to="/support" className="header__nav-link">Support</Link>
        <Link to="/theory" className="header__nav-link">Theory</Link>
        <a href="#" className="header__nav-link">About</a>
      </nav>

      <div className="header__right">
        {/* Theme toggle */}
        <button
          className="header__theme-btn"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* User avatar + dropdown */}
        <div className="header__user" onClick={() => setUserMenuOpen(v => !v)}>
          <div className="header__avatar">{initials}</div>
          <span className="header__username">
            {user?.displayName?.split(" ")[0] ?? "Account"}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {userMenuOpen && (
          <>
            <div className="header__user-overlay" onClick={() => setUserMenuOpen(false)} />
            <div className="header__user-menu">
              <div className="header__user-menu-info">
                <div className="header__avatar header__avatar--lg">{initials}</div>
                <div>
                  <p className="header__user-menu-name">{user?.displayName ?? "—"}</p>
                  <p className="header__user-menu-email">{user?.email}</p>
                </div>
              </div>
              <div className="header__user-menu-divider" />
              <Link to="/progress" className="header__user-menu-item" onClick={() => setUserMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                My Progress
              </Link>
              <Link to="/results" className="header__user-menu-item" onClick={() => setUserMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="8"  x2="16" y2="8" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
                Results
              </Link>
              <div className="header__user-menu-divider" />
              {/* Theme toggle inside menu too */}
              <button className="header__user-menu-item" onClick={() => { toggleTheme(); setUserMenuOpen(false); }}>
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              <div className="header__user-menu-divider" />
              <button className="header__user-menu-item header__user-menu-item--danger" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;