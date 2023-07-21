import { API_ROUTES, GET_REQUEST_OPTIONS } from "../utils/constants";
import { authorizedRequest } from "../utils/utils";

interface RawUser {
  ID: number;
  Username: string;
}

interface RawTweet {
  Content: string;
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  User: RawUser;
}

export interface User {
  id: number;
  username: string;
}

export interface Tweet {
  content: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TweetWithUser extends Tweet {
  user: User;
}

interface TweetsResponse {
  tweets: RawTweet[];
  msg: string;
}

export const fetchCurrentUserTweets = async () => {
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

function parseTweetsResponse(tweetsResponse: TweetsResponse): TweetWithUser[] {
  const tweets = tweetsResponse.tweets.map((tweet) => {
    return {
      content: tweet.Content,
      id: tweet.ID,
      createdAt: tweet.CreatedAt,
      updatedAt: tweet.UpdatedAt,
      user: {
        id: tweet.User.ID,
        username: tweet.User.Username,
      },
    };
  });

  return tweets;
}
