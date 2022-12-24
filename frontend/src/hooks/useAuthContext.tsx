import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as sessionApi from '../api/sessions';
import * as usersApi from '../api/users';

type AuthContextType = {
  user?: usersApi.User;
  isLoading: boolean;
  error?: any;
  logIn: ({ username, password }: sessionApi.LoginCredentials) => void;
  signUp: ({ username, password }: sessionApi.LoginCredentials) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<usersApi.User>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  // if we change location, reset the error state
  useEffect(() => {
    if (error) setError(null);
  }, [error, location.pathname]);

  // check if there is an active session when the provider is first mounted
  // if there is an error, that means there is no session
  // finally, signal that the initial load is over
  useEffect(() => {
    usersApi
      .getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error: any) => {})
      .finally(() => setIsLoadingInitial(false));
  });

  const logIn = useCallback(
    function ({ username, password }: sessionApi.LoginCredentials) {
      setIsLoading(true);

      sessionApi
        .login({ username, password })
        .then((user) => {
          user && setUser(user);
          setIsLoading(false);
          navigate('/');
        })
        .catch((_error) => setError(_error))
        .finally(() => setIsLoading(false));
    },
    [navigate]
  );

  const signUp = useCallback(
    function ({ username, password }: sessionApi.LoginCredentials) {
      setIsLoading(true);

      usersApi
        .signUp({ username, password })
        .then((user: usersApi.User) => {
          setUser(user);
          navigate('/');
        })
        .catch((_error: any) => setError(_error))
        .finally(() => setIsLoading(false));
    },
    [navigate]
  );

  const logOut: any = useCallback(function () {
    sessionApi.logout().then(() => setUser(undefined));
  }, []);

  // only rerender the provider when the user, error, or loading state changes
  //
  // whenever the `value` passed to a provide changes, the whole tree under the provider re-renders
  // and that can be very costly. useMemo to increase performance
  const memoizedValue = useMemo(
    () => ({
      user,
      isLoading,
      error,
      logIn,
      signUp,
      logOut,
    }),
    [user, isLoading, error, logIn, logOut, signUp]
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
