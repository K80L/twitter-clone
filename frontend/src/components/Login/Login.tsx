import { useState, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import './styles.css';

export default function Login({ setToken }: any): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading, error } = useAuthContext();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type?: string) {
    if (type === 'user') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login({ username, password });
    navigate('/home');
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
