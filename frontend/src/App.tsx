import {
  BrowserRouter,
  Navigate,
  Route,
  RouteProps,
  Routes,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Preferences from "./components/Preferences/Preferences";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Loader from "./components/Loader/Loader";
import useAuthContext, { AuthProvider } from "./hooks/useAuthContext";
import Nav from "./components/Nav/Nav";
import Explore from "./components/Explore/Explore";

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

/**
 * Create the react-query client and set default options
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

function App() {
  const { isLoading } = useAuthContext();

  if (isLoading) return <Loader />;

  return (
    <div className="wrapper">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Nav />
            <main className="main">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/preferences"
                  element={
                    <PrivateRoute>
                      <Preferences />
                    </PrivateRoute>
                  }
                />
              </Routes>
              <div className="placeholder"></div>
            </main>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />{" "}
        </QueryClientProvider>
      </BrowserRouter>
      {/* This is just devtools that can be removed/hidden */}
    </div>
  );
}

export default App;
