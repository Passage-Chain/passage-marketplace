import React, { useState, useEffect } from "react";
import { Badge } from "antd";
import { CustomAvatar, CustomSearchInput } from "../custom";
import socialService from "../../services/social";
import worldService from "../../services/world";
import { Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { ReactComponent as Followingicon } from "../../assets/images/Following-icon.svg";
import { ReactComponent as Followersicon } from "../../assets/images/Followers-icon.svg";
import { useDispatch, useSelector } from "react-redux";

import { ReactSVG } from "react-svg";
import extend from "../../assets/images/extend.svg";
import { ReactComponent as FriendsIcon } from "../../assets/images-v2/friends-white.svg";
import { ReactComponent as SearchIcon } from "../../assets/images-v2/search.svg";
import { ReactComponent as AddFriendIcon } from "../../assets/images-v2/add-friend.svg";
import { ReactComponent as FriendInviteIcon } from "../../assets/images-v2/friend-invite.svg";
import { ReactComponent as ArrowDownIcon } from "../../assets/images-v2/arrow-down.svg";
import StrangeClanIcon from "../../assets/images-v2/strange-clan.png";
import { ReactComponent as RefreshIcon } from "../../assets/images-v2/refresh.svg";
import { ReactComponent as AcceptCheckIcon } from "../../assets/images-v2/accept-check.svg";
import { ReactComponent as AcceptActiveCheckIcon } from "../../assets/images-v2/accept-active.svg";
import { ReactComponent as CloseXIcon } from "../../assets/images-v2/close-x.svg";
import { ReactComponent as CloseXActiveIcon } from "../../assets/images-v2/close-active.svg";
import { ReactComponent as ExitIcon } from "../../assets/images-v2/exit-icon.svg";
import { ReactComponent as FriendsGreyIcon } from "../../assets/images-v2/friends-grey.svg";
import { ReactComponent as VerifiedIcon } from "../../assets/images-v2/verified-icon.svg";
import { ReactComponent as EarlyIcon } from "../../assets/images-v2/early-adopter-icon.svg";
import { ReactComponent as SendIcon } from "../../assets/images-v2/send-icon.svg";
import { ReactComponent as LeftArrowIcon } from "../../assets/images-v2/arrow-left-icon.svg";
import { ReactComponent as CrossIcon } from "../../assets/images/icon-cross.svg";

import AddFreind from "./AddFriends";
import ConfirmModal from "./ConfirmModal";
import { setAccused, setShowReportUserModal } from "../../redux/reportSlice";
import feedService from "../../services/Feed";
import Toast from "../custom/CustomToast";
import {
  setChatMessage,
  setChatUserId,
  setDmTimestamp,
  setIsDM,
  setShowChatWindow,
} from "../../redux/chatSlice";
import { getDurationFromNow } from "../Chat/utils";
import { FEED_USER_TYPES } from "src/utils/globalConstant";

const TABS = {
  FRIEND_LIST: "FRIEND_LIST",
  PENDING_LIST: "PENDING_LIST",
  ADD_FRIENDS: "ADD_FRIENDS",
};

const tags = [
  { label: "Verified", icon: <VerifiedIcon />, color: "#78BAD6" },
  { label: "Early Adopter", icon: <EarlyIcon />, color: "#FFDBA6" },
  { label: "Badge three", icon: <VerifiedIcon />, color: "#F28F38" },
];

const FriendOptions = ({
  friend,
  onSuccess,
  fromTop,
  onGameInviteSuccess,
  gameInviteDetail,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedWorld } = useSelector((state) => state.world);

  const handleRemoveFriend = async () => {
    try {
      const payload = { friendId: friend?.friendId };
      await socialService.removeFriend(payload);
      Toast.success(
        "Friend Removed!",
        `${friend?.nickname} was removed from your friend list.`
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  };

  const handleReportUser = () => {
    dispatch(setAccused(friend));
    dispatch(setShowReportUserModal(true));
  };

  const handleMessageClick = () => {
    dispatch(setShowChatWindow(true));
    dispatch(setChatUserId(friend?.friendId));
  };

  const handleInviteToGameClick = async () => {
    try {
      const payload = {
        friendId: friend?.friendId,
        gameId: selectedWorld,
      };
      await worldService.inviteFriendToGame(payload);
      onGameInviteSuccess();
      Toast.success(
        `Game invitation has been sent to ${friend?.nickname}.`,
        ""
      );
    } catch (error) {
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  };

  const isInvitedToday = gameInviteDetail?.isInvited;

  return (
    <div
      id="friend-options-container"
      className="friend-options-container"
      style={{ top: fromTop - 85 }}
    >
      <div className="foc-list">
        <div className="foc-list-item">Join</div>
        <div className="foc-list-item" onClick={handleMessageClick}>
          Open chat
        </div>
        <div className="foc-list-item" onClick={handleReportUser}>
          Report user
        </div>
        {selectedWorld && !isInvitedToday && (
          <div className="foc-list-item" onClick={handleInviteToGameClick}>
            Invite for game
          </div>
        )}
        <div className="foc-list-item" onClick={handleRemoveFriend}>
          Delete from friend list
        </div>
      </div>
    </div>
  );
};

const FriendDetails = ({ friend, handleClose }) => {
  const history = useHistory();
  const account = useSelector((state) => state.account);
  const [isFollowing, setisFollowing] = useState(false);
  const [counts, setCounts] = useState([]);
  const [badgesList, setbadgesList] = useState([]);
  const [isBadgeExpanded, setisBadgeExpanded] = useState(false);

  useEffect(() => {
    handlecheckForFollowing();
    handleFollowCount();
    handleuserBadges();
  }, [friend?.friendId]);

  const tagscolors = [
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
    "#78BAD6",
    "#FFDBA6",
    "#F28F38",
  ];

  const followUser = async () => {
    try {
      const payload = {
        followingId: friend.friendId,
      };
      await feedService.followUser(account.token, payload);
      handlecheckForFollowing();
      handleFollowCount();
    } catch (error) {
      console.log(error);
    }
  };
  const handleuserBadges = async () => {
    try {
      const response = await feedService.allUserBadges(
        account.token,
        friend.friendId
      );
      setbadgesList(response?.data);
      //setCounts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFollowCount = async () => {
    try {
      const response = await feedService.followCount(
        account.token,
        friend.friendId
      );
      setCounts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const unfollowUser = async () => {
    try {
      const payload = {
        followingId: friend.friendId,
      };
      await feedService.unFollowUser(account.token, payload);
      handlecheckForFollowing();
      handleFollowCount();
    } catch (error) {
      console.log(error);
    }
  };
  const handlecheckForFollowing = async () => {
    const response = await feedService.checkForFollowing(
      account.token,
      friend.friendId
    );
    setisFollowing(response?.data?.isFollowing);
  };

  const handleUserClick = () => {
    history.push("/feeds", {
      friend: friend,
      usertype: FEED_USER_TYPES.OTHER,
    });
  };
  const dispatch = useDispatch();
  const { chatMessage } = useSelector((state) => state.chat);

  const handleMessageInput = (message) => {
    dispatch(setChatMessage(message));
  };

  const handleSendMessage = () => {
    dispatch(setChatUserId(friend?.friendId));
    dispatch(setIsDM(true));
    dispatch(setShowChatWindow(true));
    dispatch(setDmTimestamp(new Date().getTime()));
  };

  const expandBadgeDiv = () => {
    setisBadgeExpanded(true);
  };

  return (
    <div
      className={
        badgesList.length > 0
          ? isBadgeExpanded == true
            ? "extended-height friend-details-container"
            : " normal-height friend-details-container"
          : "friend-details-container"
      }
    >
      {/* <div className="friend-details-container":"friend-options-container-extend"> */}
      <div className="fdc-header">
        <div className="fdc-header-left">
          <CustomAvatar image={friend.profileImage} size={56} />
          <div className="friend-detail-block">
            <span className="friend-name">{friend?.nickname}</span>
            <span className="clan-name">{friend?.clanName}</span>
          </div>
        </div>
        <div className="fdc-header-right">
          {/* as of now we are commenting it
          {!friend?.clanName ? (
            <img
              src={StrangeClanIcon}
              alt={friend?.clanName}
              className="clan-icon"
            />
          ) : (
            ""
          )} */}
          <Tooltip placement="top" title="Close">
            <ExitIcon className="exit-icon" onClick={handleClose} />
          </Tooltip>
        </div>
      </div>
      <div className="fdc-content">
        <div className="fdc-cta">
          <Tooltip placement="top" title={"Go To Profile"}>
            <button className="fdc-cta-btn" onClick={handleUserClick}>
              Profile
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              isFollowing == true ? "Click to Unfollow" : "Click to Follow"
            }
          >
            <button
              className="fdc-cta-btn"
              onClick={isFollowing == true ? unfollowUser : followUser}
            >
              {isFollowing == true ? "UNFOLLOW" : "FOLLOW"}
            </button>
          </Tooltip>
        </div>
        <div className="fdc-counts">
          <div className="fdc-count-wrapper">
            <Tooltip placement="top" title={"Following"}>
              <Followingicon />
              <span className="count-txt">{counts.following}</span>
            </Tooltip>
          </div>
          <div className="fdc-count-wrapper">
            <Tooltip placement="top" title={"Followers"}>
              <Followersicon />
              <span className="count-txt">{counts.followers}</span>
            </Tooltip>
          </div>
          <div className="fdc-count-wrapper">
            <Tooltip placement="top" title={"Friends"}>
              <FriendsGreyIcon />
              <span className="count-txt">{counts.friends}</span>
            </Tooltip>
          </div>
        </div>

        <div className="fdc-tags">
          {!isBadgeExpanded &&
            badgesList.map(
              (tag, index) =>
                index < 5 && (
                  <div key={index} className="tag-wrapper">
                    <img className="badge_image" src={tag?.badge?.image} />
                    <span
                      style={{ color: tagscolors[index] }}
                      className="tag-label"
                    >
                      {tag.badge.badgeName}
                    </span>
                  </div>
                )
            )}
          {isBadgeExpanded &&
            badgesList.map((tag, index) => (
              <div key={index} className="tag-wrapper">
                <img className="badge_image" src={tag?.badge?.image} />
                <span
                  style={{ color: tagscolors[index] }}
                  className="tag-label"
                >
                  {tag.badge.badgeName}
                </span>
              </div>
            ))}
          {badgesList.length > 5 && !isBadgeExpanded && (
            <div className="extend">
              <ReactSVG src={extend} onClick={expandBadgeDiv}></ReactSVG>
            </div>
          )}
        </div>

        <div className="fdc-message-wrapper">
          <CustomSearchInput
            placeholder="Write a message..."
            maxLength={500}
            expanded={true}
            style={{ width: "100%" }}
            suffix={
              <SendIcon
                className="cursor-pointer"
                onClick={handleSendMessage}
              />
            }
            value={chatMessage}
            onChange={handleMessageInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Friend = ({ friend, handleLeftClick, handleRightClick }) => {
  return (
    <>
      <div className="friend-block-wrapper">
        <div
          className="left-block cursor-pointer"
          onClick={() => handleLeftClick(friend)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const { y } = e.target.getBoundingClientRect();
            handleRightClick(friend, y);
          }}
        >
          <Badge
            dot={true}
            color={friend.isOnline ? "green" : "#B7B7B7"}
            size="small"
          >
            <CustomAvatar image={friend.profileImage} size={36} />
          </Badge>
          <div className="friend-detail">
            <span className="name-label">{friend.nickname}</span>
            {friend.clanName ? (
              <span className="clan-name-label">
                {" "}
                {!friend.isOnline && <RefreshIcon />} {friend.clanName}
              </span>
            ) : friend.isOnline ? (
              <span className="online-label">Online</span>
            ) : (
              <span className="offline-label">
                {getDurationFromNow(friend.lastActiveAt)}
              </span>
            )}
          </div>
        </div>
        {friend.clanName && friend.isOnline ? (
          <img
            src={StrangeClanIcon}
            alt={friend.clanName}
            className="clan-icon"
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

const PendingFriend = ({
  pendingFriend,
  onSuccess,
  handleAcceptRequestClick,
}) => {
  const handleRejectRequest = async () => {
    try {
      const response = await socialService.rejectFriendRequest({
        hash: pendingFriend?.hash,
      });
      Toast.success(
        "Invitation Cancelled!",
        `You have cancelled the invitation for ${pendingFriend?.userData?.nickname}.`
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  };

  return (
    <div className="pending-friend-wrapper">
      <div className="left-block">
        <CustomAvatar size={36} image={pendingFriend?.userData?.profileImage} />
        <div className="friend-detail">
          <span className="name-label">
            {pendingFriend?.userData?.nickname}
          </span>
        </div>
      </div>

      <div className="right-block">
        <div className="accept-icon-green-wrapper">
          <Tooltip placement="left" title="Accept">
            <AcceptCheckIcon
              className="accept-icon"
              onClick={() => handleAcceptRequestClick(pendingFriend)}
            />
          </Tooltip>
        </div>
        <div className="accept-icon-wrapper">
          <Tooltip placement="left" title="Cancel">
            <CloseXIcon className="close-icon" onClick={handleRejectRequest} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const SentFriend = ({
  sentFriend,
  onSuccess,
  handleCancelRequestClick,
  listType,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="pending-friend-wrapper">
      <div className="left-block">
        <CustomAvatar size={36} image={sentFriend?.userData?.profileImage} />
        <div className="friend-detail">
          {listType === "gameInvites" ? (
            <span className="name-label">{sentFriend?.nickname}</span>
          ) : (
            <span className="name-label">
              {sentFriend?.userData?.nickname || sentFriend?.userData?.email}
            </span>
          )}
        </div>
      </div>

      <div className="right-block">
        {listType !== "gameInvites" && (
          <div className="accept-icon-wrapper">
            <Tooltip placement="left" title="Cancel">
              <CloseXIcon
                className="accept-icon"
                onClick={() => handleCancelRequestClick(sentFriend)}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

const FriendList = ({
  friendList,
  onlineUsers,
  onSuccess,
  searchStr,
  searchMode,
  onGameInviteSuccess,
  sentGameInviteList,
}) => {
  const [expandOnline, setExpandOnline] = useState(true);
  const [expandOffline, setExpandOffline] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [updatedFriendList, setUpdatedFriendList] = useState(friendList);
  const [showDetails, setShowDetails] = useState(false);
  const [showOption, setShowOptions] = useState(false);
  const [selectedFriend, setSeletedFriend] = useState({});

  const [fromTop, setFromTop] = useState(0);

  const handleLeftClick = (friend) => {
    setSeletedFriend(friend);
    setShowDetails(true);
  };

  const handleRightClick = (friend, fromTop) => {
    setSeletedFriend(friend);
    setShowOptions(true);
    setFromTop(fromTop);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  useEffect(() => {
    document.addEventListener("click", function (e) {
      var container = document.getElementById("friend-options-container");
      if (!container?.contains(e.target)) {
        closeOptions();
      }
    });
  }, []);

  useEffect(() => {
    const onlineUserIds = onlineUsers
      .filter((user) => user.online)
      .map((user) => user.id);
    const userLastActiveTime = {};
    onlineUsers.forEach((user) => {
      userLastActiveTime[user.id] = user.last_active;
    });
    let updatedFriendList = friendList.map((friend) => ({
      ...friend,
      isOnline: onlineUserIds.includes(friend.friendId),
      lastActiveAt: userLastActiveTime[friend.friendId],
    }));

    if (searchMode) {
      updatedFriendList = updatedFriendList.filter((friend) =>
        friend.nickname?.toLowerCase()?.includes(searchStr?.toLowerCase())
      );
    }
    const onlineCount = updatedFriendList.reduce(
      (acc, currentValue) => (currentValue.isOnline ? acc + 1 : acc),
      0
    );
    const offlineCount = updatedFriendList.reduce(
      (acc, currentValue) => (currentValue.isOnline ? acc : acc + 1),
      0
    );
    setOnlineCount(onlineCount);
    setOfflineCount(offlineCount);
    setUpdatedFriendList(updatedFriendList);
  }, [friendList, onlineUsers, searchStr]);

  const toggleExpandOnline = () => {
    setExpandOnline(!expandOnline);
  };

  const toggleExpandOffline = () => {
    setExpandOffline(!expandOffline);
  };

  return (
    <>
      {showDetails && (
        <FriendDetails
          friend={selectedFriend}
          handleClose={() => setShowDetails(false)}
        />
      )}
      {showOption && (
        <FriendOptions
          friend={selectedFriend}
          fromTop={fromTop}
          onSuccess={() => {
            onSuccess && onSuccess();
            setShowOptions(false);
          }}
          onGameInviteSuccess={onGameInviteSuccess}
          gameInviteDetail={sentGameInviteList.find(
            (friend) => friend?.id === selectedFriend?.friendId
          )}
        />
      )}
      <div className="list-container">
        <div className="list-header" onClick={toggleExpandOnline}>
          <ArrowDownIcon className={expandOnline ? "arrow-up-icon" : ""} />
          <span className="list-label">Online: {onlineCount}</span>
        </div>

        {expandOnline && (
          <div className="list-wrapper">
            {updatedFriendList
              .filter((friend) => friend.isOnline)
              .map((friend, index) => (
                <Friend
                  key={index}
                  friend={friend}
                  handleLeftClick={handleLeftClick}
                  handleRightClick={handleRightClick}
                />
              ))}
          </div>
        )}
      </div>

      <div className="list-container">
        <div className="list-header" onClick={toggleExpandOffline}>
          <ArrowDownIcon className={expandOffline ? "arrow-up-icon" : ""} />
          <span className="list-label">Offline: {offlineCount}</span>
        </div>

        {expandOffline && (
          <div className="list-wrapper">
            {updatedFriendList
              .filter((friend) => !friend.isOnline)
              .map((friend, index) => (
                <Friend
                  key={index}
                  friend={friend}
                  handleLeftClick={handleLeftClick}
                  handleRightClick={handleRightClick}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
};

const PendingList = ({ pendingList, onSuccess }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);

  const handleAcceptRequestClick = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleAcceptFriendRequest = async (user) => {
    try {
      const response = await socialService.acceptFriendRequest({
        hash: user?.hash,
      });
      Toast.success(
        "Invitation Accepted!",
        `You have accepted the invitation sent by ${user?.nickname}.`
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
    setSelectedUser(undefined);
    setShowConfirmModal(false);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          user={{ ...selectedUser?.userData, hash: selectedUser?.hash }}
          type="acceptInvite"
          onCancel={() => {
            setShowConfirmModal(false);
          }}
          onOkay={(user) => handleAcceptFriendRequest(user)}
        />
      )}
      <div className="list-container">
        <div className="list-header">
          <span className="list-label">Invitations</span>
        </div>

        <div className="list-wrapper">
          {pendingList.map((friend, index) => (
            <PendingFriend
              key={index}
              pendingFriend={friend}
              onSuccess={onSuccess}
              handleAcceptRequestClick={handleAcceptRequestClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const SentList = ({ sentList, onSuccess, listType }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);

  const handleCancelRequestClick = (user) => {
    setSelectedUser(user?.userData);
    setShowConfirmModal(true);
  };

  const handleCancelFriendRequest = async (user) => {
    try {
      await socialService.cancelFriendRequest({
        identifier: user?._key || user?.email,
      });
      Toast.success(
        "Invite Cancelled!",
        `You have cancelled your invitation for ${user?.nickname}.`
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
    setSelectedUser(undefined);
    setShowConfirmModal(false);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          user={selectedUser}
          type="cancel"
          onCancel={() => {
            setShowConfirmModal(false);
          }}
          onOkay={(user) => handleCancelFriendRequest(user)}
        />
      )}
      <div className="list-container">
        <div className="list-header">
          <span className="list-label">
            {listType === "gameInvites"
              ? "Sent Game Invitations"
              : "Sent Invitations"}
          </span>
        </div>

        <div className="list-wrapper">
          {sentList.map((friend, index) => (
            <SentFriend
              key={index}
              sentFriend={friend}
              onSuccess={onSuccess}
              handleCancelRequestClick={handleCancelRequestClick}
              listType={listType}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const MaximizedFriendList = ({
  handleMinimize,
  friendList,
  pendingList,
  sentList,
  fetchFriends,
  fetchPendingInvites,
  fetchSentInvites,
  onlineUsers,
  fetchGameInvites,
  sentGameInviteList,
}) => {
  const [activeTab, setActiveTab] = useState(TABS.FRIEND_LIST);
  const [searchMode, setSearchMode] = useState(false);
  const [searchStr, setSearchStr] = useState("");

  useEffect(() => {
    if (activeTab === TABS.PENDING_LIST) {
      fetchPendingInvites();
      fetchGameInvites();
      fetchSentInvites();
    } else if (activeTab === TABS.FRIEND_LIST) {
      fetchFriends();
    }
  }, [activeTab]);

  const handleBackClick = () => {
    setActiveTab(TABS.FRIEND_LIST);
  };

  const handleSearchClick = () => {
    setSearchMode(true);
    setActiveTab(TABS.FRIEND_LIST);
  };

  return (
    <div className="max-friend-list-container">
      <div className="header">
        {searchMode ? (
          <CustomSearchInput
            style={{ height: 32 }}
            fullWidth={true}
            prefix={<SearchIcon />}
            suffix={
              <CrossIcon
                style={{ width: 8, height: 8 }}
                className="cursor-pointer"
                onClick={() => setSearchMode(false)}
              />
            }
            onChange={setSearchStr}
            value={searchStr}
            expanded={true}
          />
        ) : (
          <>
            <div className="header-left">
              <Tooltip placement="left" title={"Collapse"}>
                <div className="minimize-icon-wrapper">
                  <FriendsIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimize();
                    }}
                  />
                </div>
              </Tooltip>
              <span className="header-label">Friends</span>
            </div>

            <div className="header-right">
              <Tooltip placement="left" title={"Add Friend"}>
                <AddFriendIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveTab(TABS.ADD_FRIENDS);
                  }}
                />
              </Tooltip>
              <Tooltip placement="left" title={"Invitations"}>
                <FriendInviteIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveTab(TABS.PENDING_LIST);
                  }}
                />
              </Tooltip>
              <Tooltip placement="left" title={"Search Friends"}>
                <SearchIcon
                  className="cursor-pointer"
                  onClick={handleSearchClick}
                />
              </Tooltip>
            </div>
          </>
        )}
      </div>

      <div className="content">
        {activeTab === TABS.FRIEND_LIST && (
          <FriendList
            searchStr={searchStr}
            searchMode={searchMode}
            friendList={friendList}
            onlineUsers={onlineUsers}
            onSuccess={() => {
              fetchFriends();
            }}
            onGameInviteSuccess={() => {
              fetchGameInvites();
            }}
            sentGameInviteList={sentGameInviteList}
          />
        )}
        <div style={{ height: "100%" }}>
          {activeTab === TABS.PENDING_LIST || activeTab === TABS.ADD_FRIENDS ? (
            <div className="cursor-pointer" onClick={handleBackClick}>
              <LeftArrowIcon className="back-icon" />
              <span className="back-label">Friend List</span>
            </div>
          ) : (
            ""
          )}
          <div
            style={{
              height: "100%",
              paddingLeft:
                activeTab === TABS.PENDING_LIST ||
                activeTab === TABS.ADD_FRIENDS
                  ? 10
                  : 0,
            }}
          >
            {activeTab === TABS.PENDING_LIST && (
              <>
                <PendingList
                  pendingList={pendingList}
                  onSuccess={() => {
                    fetchFriends();
                    fetchPendingInvites();
                  }}
                />
                <SentList
                  sentList={sentList}
                  onSuccess={() => {
                    fetchSentInvites();
                  }}
                />
                <SentList
                  sentList={sentGameInviteList}
                  listType="gameInvites"
                />
              </>
            )}
            {activeTab === TABS.ADD_FRIENDS && (
              <AddFreind friendList={friendList} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaximizedFriendList;
