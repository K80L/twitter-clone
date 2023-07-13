type CustomFetch = {
  url: string;
  jwt: string;
  requestMethod: "GET" | "POST" | "PUT" | "DELETE";
  requestBody: any;
};

type CustomFetchData = {
  headers: { [key: string]: string };
  method: string;
  body?: string;
  Authorization?: string;
};

export function getTokenFromLocalStorage(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

// This function attaches the JWT token to each request
// and logs out if unverified.
// TODO: Use this to send ALL requests.
export async function authorizedRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let token = localStorage.getItem("token");

  if (token) {
    options.headers = options.headers || {};
    if (!(options.headers instanceof Headers)) {
      options.headers = new Headers(options.headers);
    }
    options.headers.set(
      "Authorization",
      `Bearer ${token.replace(/['"]+/g, "")}`
    );
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    logout();
  }

  if (!response.ok) {
    throw new Error("Error in: " + url);
  }

  return response.json();
}

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
