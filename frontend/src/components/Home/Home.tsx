import TweetBox from "./TweetBox/TweetBox";
import TweetsList from "./TweetsList/TweetsList";
import "./styles.scss";

export default function Home() {
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
