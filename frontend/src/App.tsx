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
import { authorizeToken } from './api/sessions';
import useAuthContext, { AuthProvider } from './hooks/useAuthContext';

function App() {
  const { token, setToken } = useToken();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      authorizeToken(token, setIsTokenValid);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isTokenValid) {
    return <Login setToken={setToken} />;
  }

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
