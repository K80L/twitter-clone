import { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Loader from './components/Loader/Loader';
import useToken from './components/Login/useToken';

interface AuthorizedResponse {
  msg: string;
  data: boolean;
}

function App() {
  const { token, setToken } = useToken();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    }

    authorizeToken(token);
  }, [token]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isTokenValid) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />}></Route>
          <Route path="/tweets" element={<Dashboard />}></Route>
          <Route path="/preferences" element={<Preferences />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
