import { useQuery } from "@tanstack/react-query";
import TweetBox from "./TweetBox/TweetBox";
import TweetsList from "./TweetsList/TweetsList";
import "./styles.scss";
import { fetchAllTweets } from "../../api/tweets";

export default function Home() {
  const results = useQuery(["allTweets"], fetchAllTweets);
  if (results.isLoading) {
    return <div>...Loading</div>;
  }
  console.log(results);

  return (
    <div className="home__container">
      <div className="home__placeholder">
        <div className="home__placeholder-top">Home</div>
        <div className="home__placeholder-bottom">
          <div className="home__placeholder-bottom--for-you">For you</div>
          <div className="home__placeholder-bottom--following">Following</div>
        </div>
      </div>
      <TweetBox />
      <TweetsList />
    </div>
  );
}
