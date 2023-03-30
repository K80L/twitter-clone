import "./styles.css";

function TweetBox() {
  function handleSubmit(): void {
    console.log("Posting to tweeter!!");
  }

  return (
    <div className="tweet-container">
      <div className="avatar-img-container"></div>
      <div className="tweet-message-container">
        <input
          type="text"
          className="tweet__input"
          placeholder="What's happening?"
        />
        <div className="tweet-options-row">
          <div className="tweet-media-options"></div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
