import { useState, useRef, FormEvent } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import "./styles.css";

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, isLoading, error } = useAuthContext();
  const activeElement = useRef(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type?: string) {
    if (type === "user") {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login({ username, password });
  };

  return (
    <form className="login-wrapper" onSubmit={handleSubmit}>
      <div>
        <div className="login__item">
          <label className="login__label blue" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="login__input"
            value={username}
            onChange={(e) => handleChange(e, "user")}
          />
        </div>
        <div className="login__item">
          <label className="login__label blue" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="login__input"
            value={password}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="login__button-group">
        <button
          className="
            btn--secondary 
            btn--rounded 
            btn--full-width"
          disabled={isLoading}
          type="submit"
        >
          Sign in
        </button>
        {error && (
          <p className="login__message-error">Bad username or password</p>
        )}
        <Link className="signup__link" to="/signup">
          <button
            className="
              btn--primary
              btn--rounded
              btn--full-width"
          >
            Create account
          </button>
        </Link>
      </div>
    </form>
  );
}
