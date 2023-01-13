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

// Customzed fetch function that adds authorization header
// TODO: Improve error handling, etc..
export async function customFetch({
  url,
  jwt,
  requestMethod,
  requestBody,
}: CustomFetch) {
  const fetchData: CustomFetchData = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: requestMethod,
  };

  if (jwt) fetchData.headers.Authorization = 'Bearer ' + jwt;

  if (requestBody) fetchData.body = JSON.stringify(requestBody);

  const response = await fetch(url, fetchData);
  if (response.ok) return await response.json();

  // return fetch(url, fetchData).then((response) => {
  //   if (response.ok) return response.json();
  // });
}

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}
