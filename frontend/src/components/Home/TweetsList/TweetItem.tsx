import { Tweet } from "../../../api/tweets";

interface TweetItemProps {
  tweet: Tweet;
}

export default function TweetItem({ tweet }: TweetItemProps) {
  return <div>{tweet.content}</div>;
}
