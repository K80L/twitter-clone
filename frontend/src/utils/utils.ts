type CustomFetch = {
  url: string;
  jwt: string;
  requestMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestBody: any;
};

type CustomFetchData = {
  headers: { [key: string]: string };
  method: string;
  body?: string;
  Authorization?: string;
};

export function getTokenFromLocalStorage(): string | null {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}

// This function attaches the JWT token to each request
// and logs out if unverified.
// Use this to send ALL requests.
export async function authorizedRequest(
  url: string,
  options: RequestInit = {}
) {
  console.log('AAAAAAAAAAAA');
  const token = localStorage.getItem('token');

  if (token) {
    options.headers = options.headers || {};
    if (!(options.headers instanceof Headers)) {
      options.headers = new Headers(options.headers);
    }
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    logout();
  }

  return response;
}

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
