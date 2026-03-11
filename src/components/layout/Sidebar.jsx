import { Link, useLocation } from "react-router-dom";
import LogoLight from "../../Logo-Light.png";
import LogoDark from "../../Logo-Dark.png";
import { useTheme } from "../../context/ThemeContext";

const NAV_SECTIONS = [
  {
    label: "Learn",
    items: [
      {
        to: "/home",
        label: "Home",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        to: "/diagnostics",
        label: "Diagnostics",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
        badge: "Start here",
      },
      {
        to: "/profile",
        label: "Profile",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
        ),
      },
      {
        to: "/practice",
        label: "Practice",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "User hub",
    items: [
      {
        to: "/profile",
        state: { tab: "progress" },
        label: "My Progress",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        to: "/profile",
        state: { tab: "results" },
        label: "Results",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="8"  x2="16" y2="8" />
            <line x1="8" y1="16" x2="12" y2="16" />
          </svg>
        ),
      },
      {
        to: "/profile",
        state: { tab: "notes" },
        label: "Notes",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        to: "/theory",
        label: "Theory",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        to: "/homework",
        label: "Homework",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="7" y1="7" x2="17" y2="7" />
            <line x1="7" y1="11" x2="17" y2="11" />
          </svg>
        ),
      },
      {
        to: "/practice",
        label: "Practice",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Other",
    items: [
      {
        to: "/support",
        label: "Support",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
    ],
  },
];

const Sidebar = ({ open, onClose }) => {
  const { theme } = useTheme();
  const location = useLocation();

  // An item is "active" if the path matches AND either there's no state
  // requirement on the item, or the current location state tab matches.
  const isActive = (item) => {
    if (location.pathname !== item.to) return false;
    if (!item.state?.tab) return true;
    return location.state?.tab === item.state.tab;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${open ? "sidebar-backdrop--visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="">
              {theme === "light" ? (
                <img src={LogoDark} className="axioma-logo" alt="" />
              ) : (
                <img src={LogoLight} className="axioma-logo" alt="" />
              )}
            </div>
            <span className="sidebar__brand-name">Axioma</span>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="sidebar__section">
              <p className="sidebar__section-label">{section.label}</p>
              {section.items.map((item, i) => (
                <Link
                  key={`${item.to}-${item.state?.tab ?? i}`}
                  to={item.to}
                  state={item.state}
                  className={`sidebar__item ${isActive(item) ? "sidebar__item--active" : ""}`}
                  onClick={onClose}
                >
                  <span className="sidebar__item-icon">{item.icon}</span>
                  <span className="sidebar__item-label">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar__item-badge">{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__footer-card">
            <p className="sidebar__footer-card-title">Ready to map your mind?</p>
            <p className="sidebar__footer-card-sub">Run a full diagnostic to find your reasoning gaps.</p>
            <Link to="/diagnostics" className="sidebar__footer-card-btn" onClick={onClose}>
              Start Diagnostic
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;