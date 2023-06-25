import "./styles.scss";

function TweetBox() {
  function handleSubmit(): void {
    console.log("Posting to tweeter!!");
  }

  return (
    <div className="tweet">
      <div className="tweet__avatar-container"></div>
      <div className="tweet__message-container">
        <input
          type="text"
          className="tweet__input"
          placeholder="What's happening?"
        />
        <div className="tweet__options">
          <div className="tweet-media-options"></div>
          <button className="tweet__submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
