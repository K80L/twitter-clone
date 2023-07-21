import { useQuery } from "@tanstack/react-query";

import TweetItem from "./TweetItem";
import { fetchAllTweets, TweetWithUser } from "../../../api/tweets";

export default function TweetsList() {
  const { data, error, isLoading } = useQuery(["allTweets"], fetchAllTweets);

  if (error) {
    console.log(error);
  }
  if (isLoading) {
    return <div>...Loading</div>;
  }

  if (!data) return null;

  return (
    <div className="tweets__container">
      {data.map((tweetWithUser: TweetWithUser, idx: number) => (
        <TweetItem key={idx} tweet={tweetWithUser} />
      ))}
    </div>
  );
}
