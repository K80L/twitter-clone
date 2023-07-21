import { API_ROUTES, POST_REQUEST_OPTIONS } from "../utils/constants";

export type User = {
  username: string;
  password: string;
};

// TODO: Implement signup function
// TODO: Implement fetchCurrentUser function

export async function signup({ username, password }: User): Promise<User> {
  try {
    const response = await fetch(API_ROUTES.SIGN_UP, {
      ...POST_REQUEST_OPTIONS,
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (!response.ok) throw response;
    const data = response.json();

    return data;
  } catch (_error) {
    throw new Error("There was an error signing up");
  }
}

// should attempt to grab the current user from the server if possible
// and check if jwt is valid
export function getCurrentUser(): Promise<User> {
  return Promise.resolve({ username: "batman", password: "secret123" });
}
