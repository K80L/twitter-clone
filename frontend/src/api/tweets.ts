import { API_ROUTES, GET_REQUEST_OPTIONS } from "../utils/constants";
import { authorizedRequest } from "../utils/utils";

export const fetchCurrentUserTweets = async () => {
  console.log("fetchCurrentUserTweets");
  try {
    const res = await fetch(API_ROUTES.TWEETS.GET.BY_CURRENT_USER, {
      ...GET_REQUEST_OPTIONS,
    });

    if (!res.ok) {
      throw new Error("Error fetching your tweets at ");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const fetchAllTweets = async () => {
  console.log("fetchAllTweets");
  try {
    return await authorizedRequest(API_ROUTES.TWEETS.GET.ALL, {
      ...GET_REQUEST_OPTIONS,
    });
  } catch (error) {
    throw error;
  }
};

// TODO: Correctly type queryKey
export const fetchTweetsByUserId = async ({ queryKey }: any) => {
  console.log("fetchTweetsByUserId");
  try {
    const userId = queryKey[1];
    const url = API_ROUTES.TWEETS.GET.BY_USER_ID.replace(":userId", userId);
    const res = await authorizedRequest(url, {
      ...GET_REQUEST_OPTIONS,
    });

    if (!res.ok) {
      throw new Error("Error fetching tweets by user id");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};
