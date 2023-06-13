import { POST_REQUEST_OPTIONS, API_ROUTES } from "../utils/constants";

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
      ...POST_REQUEST_OPTIONS,
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
    throw new Error("There was an error logging in");
  }
}

// TODO: Implement logout function
export function logout() {
  localStorage.removeItem("token");
}

export async function authorizeToken(
  token: string,
  setToken: (token: string | null) => void,
  logout: () => void
): Promise<AuthorizedResponse> {
  if (!token) {
    return {
      msg: "No token",
      data: false,
    };
  }

  try {
    const response = await fetch("http://localhost:8080/api/validateToken", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      // there was some kind of error... what should we do here?
      // should we force them to relog?
      logout();
      setToken(null);
      throw new Error("Error authorizing token");
    }

    return await response.json();
  } catch (e) {
    throw new Error(
      `There was an error authorizing this token, you will be logged out: ${token}`
    );
  }
}
