const BASE_URL = 'http://localhost:8080';

export const BASE_REQUEST_OPTIONS: RequestInit = {
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ROUTES = {
  SESSION: {
    LOGIN: BASE_URL + `/api/login`,
  },
  SIGN_IN: BASE_URL + `/api/signin`,
  SIGN_UP: BASE_URL + `/api/signup`,
};
