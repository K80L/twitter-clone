import { useState } from 'react';
import { login } from '../../api/sessions';
import './styles.css';

export default function Login({ setToken }: any): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    if (type === 'user') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginResponse = await login({ username, password });

    loginResponse?.jwt && setToken(loginResponse.jwt);
  };

  return (
    <form className="login-wrapper" onSubmit={handleSubmit}>
      <div className="login-item">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => handleChange(e, 'user')}
          value={username}
        />
      </div>
      <div className="login-item">
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => handleChange(e, 'pass')}
          value={password}
        />
      </div>
      <div>
        <button type="submit">Sign in</button>
      </div>
    </form>
  );
}
