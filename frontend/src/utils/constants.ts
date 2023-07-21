import { getTokenFromLocalStorage } from "./utils";

const BASE_URL = "http://localhost:8080";
const TWEETS = "/tweets";

// NEED TO SEND BEARER TOKEN IN ALL MY REQUESTS!!!
// THEN THAT'S HOW GIN AUTHORIZATION MIDDLEWARE WILL AUTOMATICALLY GRAB THE AUTHORIZATION TOKEN AND DO ITS MAGIC

export const API_ROUTES = {
  SESSION: {
    LOGIN: BASE_URL + `/api/login`,
  },
  SIGN_UP: BASE_URL + `/api/signup`,
  TWEETS: {
    GET: {
      ALL: BASE_URL + TWEETS,
      BY_USER_ID: BASE_URL + TWEETS + `/:userId`,
      BY_CURRENT_USER: BASE_URL + TWEETS + `/current-user`,
    },
    POST: {
      CREATE_TWEET: BASE_URL + TWEETS,
    },
  },
};

const BASE_REQUEST_OPTIONS: RequestInit = {
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
};

export const GET_REQUEST_OPTIONS: RequestInit = {
  ...BASE_REQUEST_OPTIONS,
  method: "GET",
};

export const POST_REQUEST_OPTIONS: RequestInit = {
  ...BASE_REQUEST_OPTIONS,
  method: "POST",
};

export const DELETE_REQUEST_OPTIONS: RequestInit = {
  ...BASE_REQUEST_OPTIONS,
  method: "DELETE",
};

export const TOKEN = getTokenFromLocalStorage();
