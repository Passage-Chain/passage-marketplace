import React from "react";
import Feed from "./Feed";
import "../../styles/Feed/Post.scss";

const FeedList = ({ feedList, refreshFeeds, isLoading }) => {


  return (
   <>
      {feedList?.length > 0 ? (
        feedList.map((feedPost, index) => (
          <Feed
            className="applytoppadding"
            refreshFeeds={refreshFeeds}
            key={index}
            feedPost={feedPost}
          />
        ))
      ) : (
        <div className="no-friends-text">
          {isLoading ? "Loading..." : `No Posts available`}
        </div>
      )}
    </>
  );
};

export default FeedList;
