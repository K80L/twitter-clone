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
import { authorizeToken } from './api/sessions';

function PrivateRoute({ children }: RouteProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>();

  const location = useLocation();
  const { token } = useAuthContext();
  // add verify jwt token functionality here
  if (token) {
    authorizeToken(token).then((response) => {
      const isValid = response.data;
      console.log(response.data);
      setIsValid(isValid);
      setIsLoading(false);
    });
  } else {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return isLoading ? (
    <Loader />
  ) : isValid ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

function App() {
  const { isLoading } = useAuthContext();

  if (isLoading) return <Loader />;

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />}></Route>
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
