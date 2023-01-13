import { useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  RouteProps,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { Header } from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Loader from './components/Loader/Loader';
import useAuthContext, { AuthProvider } from './hooks/useAuthContext';
import Nav from './components/Nav/Nav';
import Explore from './components/Explore/Explore';

function PrivateRoute({ children }: RouteProps): JSX.Element {
  const location = useLocation();
  const { token, isLoading } = useAuthContext();

  // if we receive a token back from useAuthContext, that means the token is valid
  return isLoading ? (
    <Loader />
  ) : token ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

function App() {
  const { token, isLoading } = useAuthContext();

  if (isLoading) return <Loader />;

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <AuthProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />}></Route>
            <Route path="/explore" element={<Explore />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/preferences"
              element={
                <PrivateRoute>
                  <Preferences />
                </PrivateRoute>
              }
            ></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
