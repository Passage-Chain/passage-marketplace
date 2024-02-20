import React, { useState } from "react";
import WritePost from "./WritePost";
import FeedList from "./FeedList";
import "../../styles/Feed/Post.scss";
import "../../styles/Feed/SocialFeed.scss";
import { FEED_USER_TYPES } from "src/utils/globalConstant";

const FeedContainer = ({ feedList, refreshFeeds, isLoading }) => {
  const [toppadding, settoppadding] = useState(0);
  const [refreshflag, setrefreshflag] = useState(false);

  const gettoppaddingvalue = (value) => {
    settoppadding(value);
    if (value === 5) setrefreshflag(true); //for write post
    else {
      setrefreshflag(false);
    }
  };

  return (
    <div className="social_feed_container">
      <div className="postouterdiv">
        <div
          className={toppadding == 576 ? "writepostdivmulti" : "writepostdiv"}
        >
          <WritePost
            isEditEnabled={false}
            refreshFeeds={refreshFeeds}
            gettoppaddingvalue={gettoppaddingvalue}
            usertype={FEED_USER_TYPES.SELF}
          />
        </div>
        <div
          id="feed-page-container"
          className="postlistdiv"
          style={{ paddingTop: `${toppadding + "px"}` }}
        >
          <FeedList isLoading={isLoading} feedList={feedList} refreshFeeds={refreshFeeds} />
        </div>
      </div>
    </div>
  );
};

export default FeedContainer;
