import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Login from './components/Login/Login';
import useToken from './components/Login/useToken';

interface AuthorizedResponse {
  msg: string;
  data: boolean;
}

function App() {
  const { token, setToken } = useToken();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Check the return type Promise<boolean | undefined>.
    // Maybe it should just be Promise<boolean> but it is giving me an error that I don't want to look into yet
    async function authorizeToken(
      token: string
    ): Promise<AuthorizedResponse | undefined> {
      try {
        const response = await fetch('http://localhost:8080/', {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token,
          },
        });
        if (!response.ok) {
          throw new Error('Error authorizing token');
        }

        const resp: AuthorizedResponse = await response.json();
        setIsTokenValid(resp.data);
        return resp;
      } catch (e) {
        console.error(e);
      }
    }

    authorizeToken(token);
  }, [token]);

  if (!isTokenValid) {
    return <Login setToken={setToken} />;
  }
  // if (!isTokenValid(token)) {
  //   return <Login setToken={setToken} />;
  // }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/tweets" element={<Dashboard />}></Route>
          <Route path="/preferences" element={<Preferences />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
