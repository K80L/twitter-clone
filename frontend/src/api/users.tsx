export type User = {
  username: string;
  password: string;
};

// TODO: Implement signup function
// TODO: Implement fetchCurrentUser function

export function signup({ username, password }: User): Promise<User> {
  return Promise.resolve({ username: 'batman', password: 'secret123' });
}

// should attempt to grab the current user from the server if possible
// and check if jwt is valid
export function getCurrentUser(): Promise<User> {
  return Promise.resolve({ username: 'batman', password: 'secret123' });
}
