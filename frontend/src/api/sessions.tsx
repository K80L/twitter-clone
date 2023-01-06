import { BASE_REQUEST_OPTIONS, API_ROUTES } from '../utils/constants';
import * as usersApi from '../api/users';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthorizedResponse = {
  msg: string;
  data: boolean;
};

type LoginResponse = {
  jwt: string;
  msg: string;
};
export async function login({
  username,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(API_ROUTES.SESSION.LOGIN, {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) throw response;
    const data = await response.json();
    return data;
  } catch (_error) {
    console.error(_error);
    throw new Error('There was an error logging in');
  }
}

// TODO: Implement logout function
export async function logout() {}

export async function authorizeToken(
  token: string
  // setIsTokenValid: React.Dispatch<React.SetStateAction<boolean>>
): Promise<AuthorizedResponse> {
  try {
    const response = await fetch('http://localhost:8080/api/validateToken', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    if (!response.ok) {
      throw new Error('Error authorizing token');
    }

    return await response.json();

    // const resp: AuthorizedResponse = await response.json();
    // setIsTokenValid(resp.data);
    // return resp;
  } catch (e) {
    console.error(e);
    throw new Error(`There was an error authorizing this token: ${token}`);
  }
}
