import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import './styles.css';

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading, error } = useAuthContext();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type?: string) {
    if (type === 'user') {
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
      <div className="login-item">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => handleChange(e, 'user')}
        />
      </div>
      <div className="login-item">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
      </div>
      <div>
        <button disabled={isLoading} type="submit">
          Sign in
        </button>
      </div>
      {error && <p>Bad login/password</p>}
      <Link to="/signup">Sign up</Link>
    </form>
  );
}
