import { API_ROUTES, BASE_REQUEST_OPTIONS } from "../utils/constants";

export const fetchUserTweets = async () => {
  console.log("fetchUserTweets");
  try {
    const res = await fetch(API_ROUTES.TWEETS.INDEX, {
      ...BASE_REQUEST_OPTIONS,
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error fetching your tweets at ");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};
