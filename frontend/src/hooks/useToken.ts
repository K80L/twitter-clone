import { useState, useCallback } from 'react';
import { isJsonString } from '../utils/utils';

const useToken = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken =
      tokenString && isJsonString(tokenString) && JSON.parse(tokenString);
    return userToken;
  };

  const saveToken = useCallback((userToken: any) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  }, []);

  // the call to setToken in saveToken triggers the rerender
  const [token, setToken] = useState<string>(getToken());

  return {
    token,
    setToken: saveToken,
  };
};

export default useToken;
