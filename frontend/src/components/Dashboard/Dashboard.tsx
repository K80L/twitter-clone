import TweetBox from "./TweetBox/TweetBox";
import TweetsList from "./TweetsList/TweetsList";

import "./styles.css";

export default function Dashboard() {
  return (
    <div className="dashboard__container">
      <TweetBox />
      <TweetsList />
    </div>
  );
}
