import { useQuery } from "@tanstack/react-query";

import TweetItem from "./TweetItem";
import { fetchAllTweets } from "../../../api/tweets";

export default function TweetsList() {
  const {
    data: tweets,
    error,
    isLoading,
  } = useQuery(["allTweets"], fetchAllTweets);

  if (error) {
    console.log(error);
  }
  if (isLoading) {
    return <div>...Loading</div>;
  }
  return (
    <div>
      {tweets?.map((tweet, idx) => (
        <TweetItem key={idx} tweet={tweet} />
      ))}
    </div>
  );
}
