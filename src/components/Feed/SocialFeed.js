import React, { useState, useEffect } from 'react'
import UserSocialFeedProfile from "./UserSocialFeedProfile";
import FeedContainer from "./FeedContainer";
import { useSelector } from "react-redux";
import feedService from "../../services/Feed";
import { handleApiError } from "../utils/AuthVerify/AuthVerify";
import InfiniteScroll from "react-infinite-scroll-component";
import "../../styles/Feed/SocialFeed.scss";

const LIMIT = 5;

const SocialFeed = () => {
  const [feedList, setfeedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const account = useSelector((state) => state.account);

  useEffect(() => {
    fetchFeeds();
  }, [page]);

  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const response = await feedService.getUserFeed(page, LIMIT);
      const list = response?.data?.feeds || [];
      const totalCount = response?.data?.totalCount || 0;
      setIsLoading(false);
      setfeedList((feedList) => page === 1 ? list : [...feedList, ...list]);
      setTotalCount(totalCount);
    } catch (error) {
      setfeedList([]);
      setIsLoading(false);
      handleApiError(error);
    }
  };

  const loadMoreFeeds = () => {
    if (feedList.length < totalCount) {
      setPage((page) => page + 1);
    }
  };

  const refreshFeeds = () => {
    if (page === 1) {
      fetchFeeds();
    } else {
      setPage(1);
    }
  };

  return (
    <div id="feed-page-container" className="socialfeed">
      <InfiniteScroll
        dataLength={feedList?.length}
        next={loadMoreFeeds}
        hasMore={feedList.length < totalCount}
        scrollableTarget="feed-page-container"
        loader={<div style={{ width: '100%', textAlign: 'center', color: '#fff'}}>Loading...</div>}
      >
        <UserSocialFeedProfile name={account.username} />
        <FeedContainer refreshFeeds={refreshFeeds} feedList={feedList} isLoading={isLoading} />
      </InfiniteScroll>
    </div>
  );
};

export default SocialFeed;
