import { getTokenFromLocalStorage } from './utils';

const BASE_URL = 'http://localhost:8080';

// NEED TO SEND BEARER TOKEN IN ALL MY REQUESTS!!!
// THEN THAT'S HOW GIN AUTHORIZATION MIDDLEWARE WILL AUTOMATICALLY GRAB THE AUTHORIZATION TOKEN AND DO ITS MAGIC
const token = getTokenFromLocalStorage();

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
  SIGN_UP: BASE_URL + `/api/signup`,
};
