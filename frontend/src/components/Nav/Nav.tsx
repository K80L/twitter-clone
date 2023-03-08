import { Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import { Header } from '../Header/Header';
import './styles.css';

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
    <header className="header">
      <div className="overflow-auto full-height flex-col-end">
        <Header />
        <ul className="header--list">
          {buildNavItems()}
          {logoutButton()}
        </ul>
      </div>
    </header>
  );
}
