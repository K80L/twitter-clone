import { useMemo, useState } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { authorizedRequest, debounce } from "../../../utils/utils";

import "./styles.scss";

function TweetBox() {
  const [value, setValue] = useState<string>("");
  const { user } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const debouncedHandleChange = useMemo(() => debounce(handleChange), []);

  function handleSubmit() {
    // authorizedRequest();
  }

  return (
    <div className="tweet">
      <div className="tweet__avatar-container"></div>
      <div className="tweet__message-container">
        <input
          type="text"
          className="tweet__input"
          placeholder="What's happening?"
          onChange={debouncedHandleChange}
        />
        <div className="tweet__options">
          <div className="tweet-media-options"></div>
          <button
            className="tweet__submit-btn"
            type="submit"
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
