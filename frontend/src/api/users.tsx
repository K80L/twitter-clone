export type User = {
  username: string;
  password: string;
};

export function signUp({ username, password }: User): Promise<User> {}

export function getCurrentUser(): Promise<User> {}

// TODO: Implement signUp function
// TODO: Implement fetchCurrentUser function
