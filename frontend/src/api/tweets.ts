import { API_ROUTES, GET_REQUEST_OPTIONS } from "../utils/constants";
import { authorizedRequest } from "../utils/utils";

export interface Tweet {
  content: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RawTweet {
  Content: string;
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface TweetsResponse {
  tweets: RawTweet[];
  msg: string;
}

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
  try {
    const response = await authorizedRequest<TweetsResponse>(
      API_ROUTES.TWEETS.GET.ALL,
      {
        ...GET_REQUEST_OPTIONS,
      }
    );

    return parseTweetsResponse(response);
  } catch (error) {
    throw error;
  }
};

// TODO: Correctly type queryKey
export const fetchTweetsByUserId = async ({ queryKey }: any) => {
  try {
    const userId = queryKey[1];
    const url = API_ROUTES.TWEETS.GET.BY_USER_ID.replace(":userId", userId);
    const response = await authorizedRequest<TweetsResponse>(url, {
      ...GET_REQUEST_OPTIONS,
    });

    return parseTweetsResponse(response);
  } catch (error) {
    throw error;
  }
};

function parseTweetsResponse(tweetsResponse: TweetsResponse) {
  const tweets = tweetsResponse.tweets.map((tweet) => {
    return {
      content: tweet.Content,
      id: tweet.ID,
      createdAt: tweet.CreatedAt,
      updatedAt: tweet.UpdatedAt,
    };
  });

  return tweets;
}
