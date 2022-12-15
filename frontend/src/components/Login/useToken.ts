import { useState } from 'react';

const useToken = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = tokenString && JSON.parse(tokenString);
    return userToken;
  };

  const saveToken = (userToken: any) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  // the call to setToken in saveToken triggers the rerender
  const [token, setToken] = useState<string>(getToken());

  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;
