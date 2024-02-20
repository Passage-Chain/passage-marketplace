import React, { useEffect, useState } from "react";
import { ReactComponent as FollowingIcon } from "../../assets/images/Following-icon.svg";
import { ReactComponent as FollowersIcon } from "../../assets/images/Followers-icon.svg";
import { ReactComponent as FriendsIcon } from "../../assets/images/Friends-icon.svg";
import { ReactComponent as ChatIcon } from "../../assets/images/menuicon.svg";
import Avatar from "../../assets/images/left_menu_passageLogo.svg";
import { useSelector, useDispatch } from "react-redux";
import feedService from "../../services/Feed";
import WritePost from "../Feed/WritePost";
import Feed from "../../components/Feed/Feed";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../utils/AuthVerify/AuthVerify";
import { Tooltip } from "antd";
import RightContainer from "../Feed/RightContainer";
import {
  setChatUserId,
  setDmTimestamp,
  setIsDM,
  setShowChatWindow,
} from "../../redux/chatSlice";

import InfiniteScroll from "react-infinite-scroll-component";
import { FEED_USER_TYPES } from "src/utils/globalConstant";
import { CustomButton } from "../custom";

import "../ViewFeeds/ViewUserProfileWithFeeds.scss";
import "../../styles/Feed/Post.scss";
import "../../styles/Feed/SocialFeed.scss";

const LIMIT = 5;

const ViewUserProfileWithFeeds = () => {
  const location = useLocation();
  const user = location?.state?.friend;
  const usertype = location?.state?.usertype;
  const isEdit = location?.state?.isEdit == "Y" ? "Y" : "F";
  const id = location?.state?.id;
  const dispatch = useDispatch();

  const account = useSelector((state) => state.account);
  const userid = usertype == FEED_USER_TYPES.OTHER ? (user.friendId || user.id) : account.id;

  const [isLoading, setIsLoading] = useState(false);
  const [toppadding, settoppadding] = useState(0);
  const [feedList, setfeedList] = useState([]);
  const [MyWorldData, setMyWorldData] = useState([]);
  const [isFollowing, setisFollowing] = useState(false);
  const [counts, setCounts] = useState([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const history = useHistory();

  useEffect(() => {
    handlecheckForFollowing();
    handleFollowCount();
    setTotalCount(0)
    setPage(1)
  }, [userid]);

  const handleFollowCount = async () => {
    try {
      const response = await feedService.followCount(account.token, userid);
      setCounts(response?.data);
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  const handlecheckForFollowing = async () => {
    const response = await feedService.checkForFollowing(account.token, userid);
    setisFollowing(response?.data?.isFollowing);
  };

  const gettoppaddingvalue = (value) => {
    settoppadding(value);
  };

  useEffect(() => {
    fetchFeeds();
  }, [page, MyWorldData, userid]);

  const followUser = async () => {
    try {
      const payload = {
        followingId: userid,
      };

      await feedService.followUser(account.token, payload);
      handlecheckForFollowing();
      handleFollowCount();
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  const redirectSetting = () => {
    history.push("/user-settings");
  };

  const unfollowUser = async () => {
    try {
      const payload = {
        followingId: userid,
      };
      await feedService.unFollowUser(account.token, payload);
      handlecheckForFollowing();
      handleFollowCount();
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };
  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      let response = null;
      if (
        usertype == FEED_USER_TYPES.SELF ||
        usertype === FEED_USER_TYPES.OTHER
      ) {
        response = await feedService.getMyFeeds(userid, page, LIMIT);
      } else {
        response = await feedService.getWorldFeed(
          account.token,
          MyWorldData?._id
        );
      }

      const list = response?.data?.feeds || [];
      const totalCount = response?.data?.totalCount || 0;
      setIsLoading(false);
      setfeedList((feedList) => page === 1 ? list : [...feedList, ...list]);
      setTotalCount(totalCount);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      handleApiError(error);
    }
  };

  const handleChatClick = () => {
    dispatch(setChatUserId(user?.friendId));
    dispatch(setIsDM(true));
    dispatch(setShowChatWindow(true));
    dispatch(setDmTimestamp(new Date().getTime()));
  };

  const loadMoreFeeds = () => {
    if (feedList.length < totalCount) {
      setPage((page) => page + 1);
    }
  };

  const refreshFeeds = () => {
    if (page === 1) {
      fetchFeeds()
    } else {
      setPage(1)
    }
  }

  return (
    <div id="profile-page-container" className="profile-page-container">
      <InfiniteScroll
        dataLength={feedList?.length}
        next={loadMoreFeeds}
        hasMore={feedList.length < totalCount}
        scrollableTarget="profile-page-container"
        loader={<div style={{ width: '100%', textAlign: 'center', color: '#fff'}}>Loading...</div>}
      >
        <div className="profile-left-wrapper">
          <div className="profile-header-wrapper">
            <div className="pf-inner-wrapper">
              <div className="user-details-wrapper">
                <img
                  className="ud-profile-img"
                  src={
                    usertype === FEED_USER_TYPES.OTHER
                      ? user.profileImage
                      : account.avatar || Avatar
                  }
                  alt="profile_img"
                />
                <div className="ud-profle-info-wrapper">
                  <span>
                    {usertype === FEED_USER_TYPES.OTHER
                      ? user.nickname
                      : account.username}
                  </span>
                  <span className="online-txt">
                    {usertype === FEED_USER_TYPES.OTHER ? "" : "Online"}
                  </span>
                </div>
              </div>
              <div className="profile-cta-wrapper">
                {usertype === FEED_USER_TYPES.OTHER ? (
                  <CustomButton disabled={true} label="Join" />
                ) : (
                  <CustomButton
                    label="Edit Profile"
                    onClick={() => redirectSetting()}
                  />
                )}
              </div>
            </div>

            <div className="profile-header-bottom-wrapper">
              <div className="profile-count-wrapper">
                <Tooltip placement="top" title="Following">
                  <div className="counter-wrapper">
                    <FollowingIcon />
                    <span>{counts.following}</span>
                  </div>
                </Tooltip>

                <Tooltip placement="top" title="Followers">
                  <div className="counter-wrapper">
                    <FollowersIcon />
                    <span>{counts.followers}</span>
                  </div>
                </Tooltip>

                <Tooltip placement="top" title="Friends">
                  <div className="counter-wrapper">
                    <FriendsIcon />
                    <span>{counts.friends}</span>
                  </div>
                </Tooltip>
              </div>

              {usertype === FEED_USER_TYPES.OTHER && <div className="profile-cta-wrapper">
                <Tooltip
                    placement="top"
                    title={`${isFollowing ? "Unfollow" : "Follow"} User`}
                  >
                  <CustomButton
                    type="white"
                    label={isFollowing == true ? "UNFOLLOW" : "FOLLOW"}
                    onClick={isFollowing == true ? unfollowUser : followUser}
                  />
                </Tooltip>
                <Tooltip placement="top" title="Connect with user">
                  <CustomButton
                    label="Connect"
                    disabled={true}
                  />
                </Tooltip>
                <Tooltip placement="top" title="Chat with user">
                  <ChatIcon className="cursor-pointer" onClick={handleChatClick}/>
                </Tooltip>
              </div>}
            </div>
          </div>
          <div className="feed-list-wrapper">
          {usertype === FEED_USER_TYPES.OTHER ? null : (
              <WritePost
                refreshFeeds={refreshFeeds}
                usertype={usertype}
                gettoppaddingvalue={gettoppaddingvalue}
              />
          )}

            {feedList?.length > 0 ? (
                feedList.map((feedPost, index) => (
                  <Feed
                    isEdit={isEdit}
                    id={id}
                    key={index}
                    feedPost={feedPost}
                    gettoppaddingvalue={gettoppaddingvalue}
                    refreshFeeds={fetchFeeds}
                  />
                ))
              ) : (
                <div className="no-friends-text">
                  {isLoading ? "Loading..." : `No Posts available`}
                </div>
              )}
          </div>
        </div>
      </InfiniteScroll>
      <RightContainer />
    </div>
  );
};

export default ViewUserProfileWithFeeds;
