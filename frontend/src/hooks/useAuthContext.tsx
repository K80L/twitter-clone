import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as sessionApi from "../api/sessions";
import * as usersApi from "../api/users";
import useToken from "./useToken";
import { authorizeToken } from "../api/sessions";

type AuthContextType = {
  user?: usersApi.User;
  token?: string;
  isLoading: boolean;
  error?: any;
  login: ({ username, password }: sessionApi.LoginCredentials) => void;
  signup: ({ username, password }: sessionApi.LoginCredentials) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<usersApi.User>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const { token, setToken } = useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const logout: any = useCallback(
    function () {
      console.log('new logout');
      sessionApi.logout();
      setUser(undefined);
      setToken(null);
      navigate("/login");
    },
    [setToken, navigate]
  );

  // if we change location, reset the error state
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * check if there is an active session when the provider is first mounted
   * if there is an error, that means there is no session
   * finally, signal that the initial load is over
   */
  useEffect(() => {
    usersApi
      .getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error: any) => {})
      .finally(() => setIsLoadingInitial(false));
  }, []);

  /**
   * This useEffect is used for authorizing the token on render and rerender
   */
  useEffect(() => {
    console.log("ZZZZZZZZZZZZZZZZZZZZZZ");
    setIsLoading(true);
    authorizeToken(token, setToken, logout).then(() => {
      setIsLoading(false);
    });
  }, [token, setToken, logout]);

  const login = useCallback(
    function ({ username, password }: sessionApi.LoginCredentials) {
      setIsLoading(true);

      sessionApi
        .login({ username, password })
        .then((data) => {
          console.log(data);
          data && setToken(data.jwt);
          setIsLoading(false);
          navigate("/");
        })
        .catch((_error) => {
          console.log(_error);
          setError(_error);
        })
        .finally(() => setIsLoading(false));
    },
    [setToken, navigate]
  );

  const signup = useCallback(
    function ({ username, password }: sessionApi.LoginCredentials) {
      setIsLoading(true);

      usersApi
        .signup({ username, password })
        .then((user: usersApi.User) => {
          setUser(user);
          navigate("/");
        })
        .catch((_error: any) => setError(_error))
        .finally(() => setIsLoading(false));
    },
    [navigate]
  );

  // only rerender the provider when the user, error, or loading state changes
  //
  // whenever the `value` passed to a provide changes, the whole tree under the provider re-renders
  // and that can be very costly. useMemo to increase performance
  const memoizedValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, error, login, logout, signup]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
}

export default function useAuthContext() {
  return useContext(AuthContext);
}
