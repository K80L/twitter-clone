import { BASE_REQUEST_OPTIONS, API_ROUTES } from '../utils/constants';
import * as usersApi from '../api/users';
import useAuthContext from '../hooks/useAuthContext';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthorizedResponse = {
  msg: string;
  data: boolean;
};

// type LoginResponse = {
//   jwt: string;
// }
export async function login({
  username,
  password,
}: LoginCredentials): Promise<usersApi.User | undefined> {
  try {
    // TODO: Fix the url to not pass username and pw
    const response = await fetch(API_ROUTES.SIGN_IN, {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Unable to login');
    }
  } catch (e) {
    console.error(e);
  }
}

// TODO: Implement logout function
export async function logout() {}

export async function authorizeToken(
  token: string,
  setIsTokenValid: React.Dispatch<React.SetStateAction<boolean>>
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
  }
}
