import { useQuery } from "@tanstack/react-query";
import TweetBox from "./TweetBox/TweetBox";
import TweetsList from "./TweetsList/TweetsList";
import "./styles.css";
import { fetchAllTweets } from "../../api/tweets";

export default function Dashboard() {
  const results = useQuery(["allTweets"], fetchAllTweets);
  if (results.isLoading) {
    return <div>...Loading</div>;
  }
  console.log(results.data);
  return (
    <div className="dashboard__container">
      <TweetBox />
      <TweetsList />
    </div>
  );
}
