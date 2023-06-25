import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import { Header } from "../Header/Header";
import "./styles.scss";

const navItems = {
  home: "",
  explore: "explore",
  preferences: "preferences",
};
export default function Nav() {
  const { logout } = useAuthContext();

  return (
    <header className="nav">
      <Header />
      <ul className="nav__list">
        {Object.entries(navItems).map(([key, item]) => (
          <li key={key}>
            <Link to={item}>{key}</Link>
          </li>
        ))}
        <li key="logout-btn">
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </header>
  );
}

// function buildNavItems(navItems: { [key: string]: string }) {
//   return Object.entries(navItems).map(([key, item]) => (
//     <li key={key}>
//       <Link to={item}>{key}</Link>
//     </li>
//   ));
// }
