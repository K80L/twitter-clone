import moment from "moment";

import { TweetWithUser } from "../../../api/tweets";
import "./styles.scss";

interface TweetItemProps {
  tweet: TweetWithUser;
}

export default function TweetItem({ tweet }: TweetItemProps) {
  console.log(tweet);
  return (
    <div className={"tweet-item__container"}>
      <div className="tweet-item__avatar-container"></div>
      <div className="tweet-item__main-container">
        <div className="tweet-item__header">
          {tweet.user.username}{" "}
          <span className="tweet-item__date">
            {moment(tweet.createdAt).format("MMM DD, YYYY")}
          </span>
        </div>
        <div className={"tweet-item__content"}>
          <div className="tweet-item__message">{tweet.content}</div>
          <div className="tweet-item__media"></div>
        </div>
      </div>
    </div>
  );
}
