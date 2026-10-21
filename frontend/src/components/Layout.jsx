import { NavLink, Outlet } from 'react-router-dom';
import { EyeIcon, ListIcon, PlusIcon } from './Icons.jsx';

const MENU = [
  { to: '/posts', label: 'All Posts', Icon: ListIcon },
  { to: '/new', label: 'Add New', Icon: PlusIcon },
  { to: '/preview', label: 'Preview', Icon: EyeIcon },
];

export default function Layout() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="brand">Dashboard</div>
        {MENU.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
