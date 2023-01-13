import { Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';

const navItems = {
  home: '',
  explore: 'explore',
  dashboard: 'dashboard',
  preferences: 'preferences',
};

export default function Nav() {
  const { logout } = useAuthContext();

  function buildNavItems() {
    return Object.entries(navItems).map(([key, item]) => (
      <li key={key}>
        <Link to={item}>{key}</Link>
      </li>
    ));
  }

  function logoutButton() {
    return (
      <li key="logout-btn">
        <button onClick={logout}>Logout</button>
      </li>
    );
  }
  return (
    <ul className="nav-column">
      {buildNavItems()}
      {logoutButton()}
    </ul>
  );
}
