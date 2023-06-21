import { useQuery } from "@tanstack/react-query";
import TweetBox from "./TweetBox/TweetBox";
import TweetsList from "./TweetsList/TweetsList";
import "./styles.css";
import { fetchAllTweets } from "../../api/tweets";

export default function Home() {
  const results = useQuery(["allTweets"], fetchAllTweets);
  if (results.isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="home__container">
      <TweetBox />
      <TweetsList />
    </div>
  );
}
