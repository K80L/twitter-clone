import { useState } from 'react';
import './styles.css';

interface LoginResponse {
  jwt: string;
  msg: string;
}

interface Credentials {
  username: string;
  password: string;
}

async function login(credentials: Credentials) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/signin?Username=${credentials.username}&Password=${credentials.password}/`,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Unable to login');
    }
  } catch (e) {
    console.error(e);
  }
}

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

    const loginResponse: LoginResponse = await login({ username, password });
    console.log('loginResponse', loginResponse);
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
