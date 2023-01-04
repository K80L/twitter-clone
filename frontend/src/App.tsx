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
import useToken from './components/Login/useToken';
import { authorizeToken } from './api/sessions';
import useAuthContext, { AuthProvider } from './hooks/useAuthContext';

function PrivateRoute({ children }: RouteProps): JSX.Element {
  const location = useLocation();
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        children
      ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
      )}
    </>
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
