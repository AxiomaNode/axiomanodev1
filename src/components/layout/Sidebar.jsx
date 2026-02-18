import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/Authorisatisdfa';

function Sidebar() {
  const { user } = useAuth();

  if (!user) return null; 

  const links = [
    { to: '/', label: 'Home' },
    { to: '/diagnostics', label: 'Diagnostics' },
    { to: '/practice', label: 'Practice' },
    { to: '/progress', label: 'Progress' },
    { to: '/results', label: 'Results' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;