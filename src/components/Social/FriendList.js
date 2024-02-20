import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Tooltip } from "antd";

import { ReactComponent as UserIcon } from "../../assets/images/icon-user.svg";
import { ReactComponent as MessageIcon } from "../../assets/images/icon-message.svg";
import { ReactComponent as TeleportIcon } from "../../assets/images/icon-teleport.svg";
import { ReactComponent as AddFriendIcon } from "../../assets/images/icon-add-friend-new.svg";
import { ReactComponent as UnfriendIcon } from "../../assets/images/icon-remove-friend.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/icon-search.svg";
import LoaderIcon from "../../assets/images/loader.png";

import Notify from "../utils/Notification/notify";

import socialService from "../../services/social";
import ConfirmModal from "./ConfirmModal";

import { CustomInput } from "../custom";
import GameInstance from "../../services/gameInstance";
import { useSelector } from 'react-redux';

const ACTIONS = {
  REMOVE: "remove",
  TELEPORT: "teleport",
};

const FriendList = ({ openAddFriendModal, friendList, setFriendList }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(undefined);
  const [filteredList, setFilteredList] = useState([])

  const [searchQuery, setSearchQuery] = useState("")
  const account = useSelector((state) => state.account);
  const history = useHistory();

  useEffect(() => {
    if (searchQuery) {
      const filteredList = friendList.filter(friend => friend?.userName?.includes(searchQuery))
      setFilteredList(filteredList)
    } else {
      setFilteredList(friendList)
    }
  }, [searchQuery])

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:3001/', ['access_token', account.websocketToken]); // Replace with your WebSocket server URL

    // Listen for incoming messages
    socket.addEventListener('message', handleIncomingMessage);

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.removeEventListener('message', handleIncomingMessage);
      socket.close();
    };
  }, []);
  const handleIncomingMessage = (event) => {
    // Parse the received message
    const message = JSON.parse(event.data);

    // Check the message type
    if (message.type === 'friendListUpdate') {
      // Update the friend list with the new data
      filteredList(message.data);
    }
  };
  useEffect(() => {
    setFilteredList(friendList)
  }, [friendList])

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (actionType) {
      setShowConfirmModal(true);
    }
  }, [actionType]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await socialService.getFriendList();
      const list = response?.data?.result || [];
      const formattedList = list?.map(el => el.userId)
      setFriendList(formattedList);
    } catch (error) {
      console.log(error);
      setFriendList([]);
    }
    setIsLoading(false);
  };

  const teleportToUser = (user) => {
    const game = GameInstance.getInstance();
    game.teleport(user.userId._id);
  };

  const handleTeleportClick = (friend) => {
    setSelectedFriend(friend);
    setActionType(ACTIONS.TELEPORT);
  };

  const handleTeleport = async (friend) => {
    try {
      teleportToUser(friend);
      Notify.success({ title: "Teleported Successfully", body: `You have successfully teleported to ${friend?.userName}!`, action: 'teleport_success' });
    } catch (error) {
      console.log(error);
      Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
    }
    setSelectedFriend(undefined);
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleRemoveFriendClick = (friend) => {
    setSelectedFriend(friend);
    setActionType(ACTIONS.REMOVE);
  };

  const handleRemoveFriend = async (friend) => {
    try {
      const payload = { friendId: friend?._id };
      const response = await socialService.removeFriend(payload);
      Notify.error({ title: "Friend Removed!", body: `${friend?.userName} was removed from your friend list.`, action: 'invite_fail' });
      fetchFriends();
    } catch (error) {
      console.log(error);
      Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
    }
    setSelectedFriend(undefined);
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleMessageClick = (friend) => {
    history.push("/app/index/messages", { friend });
  };

  const handleSearchInput = (e) => {
    const { value } = e.target
    setSearchQuery(value)
  }

  return (
    <div>
      {showConfirmModal && (
        <ConfirmModal
          user={selectedFriend}
          type={actionType}
          onCancel={() => {
            setShowConfirmModal(false);
          }}
          onOkay={(friend) => {
            if (actionType === ACTIONS.REMOVE) {
              handleRemoveFriend(friend);
            } else if (actionType === ACTIONS.TELEPORT) {
              handleTeleport(friend);
            }
          }}
        />
      )}

      <div className="body-header">
        <div className="header-left">
          <CustomInput
            placeHolder="Search friends"
            prefix={<SearchIcon style={{ width: 16 }} />}
            height={40}
            width={312}
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
        <div
          className="social__add-friend-btn"
          onClick={() => {
            openAddFriendModal(true);
          }}
        >
          <AddFriendIcon />
          <span>ADD FRIEND</span>
        </div>
      </div>

      {filteredList?.length > 0 ? (
        <div className="body-content">
          <div className="content-header">
            <span className="left">NAME</span>
            <span className="right">ACTIONS</span>
          </div>

          <div className="content-list" id="list-container">
            {filteredList.map((friend, index) => (
              <div className="friend-wrapper" key={index}>
                <div className="left">
                  <div className="user-icon-wrapper">
                    <UserIcon />
                  </div>

                  <div className="user-detail-wrapper">
                    <span className="user-name">{friend?.nickname}</span>
                    <span className="mutual-friend-count">{friend?.email}</span>
                  </div>
                </div>

                <div className="right">
                  <Tooltip
                    overlayClassName="custom-tooltip"
                    placement="bottom"
                    title="SEND MESSAGE"
                  >
                    <div
                      className="icon-wrapper"
                      onClick={() => handleMessageClick(friend)}
                    >
                      <MessageIcon />
                    </div>
                  </Tooltip>

                  <Tooltip placement="bottom" title="TELEPORT TO">
                    <div
                      className="icon-wrapper"
                      onClick={() => handleTeleportClick(friend)}
                    >
                      <TeleportIcon
                        style={{
                          width: 11,
                          height: 19,
                        }}
                      />
                    </div>
                  </Tooltip>

                  <Tooltip placement="bottom" title="REMOVE FRIEND">
                    <div
                      className={`icon-wrapper`}
                      onClick={() => handleRemoveFriendClick(friend)}
                    >
                      <UnfriendIcon />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-friends-text">
          {isLoading ? "Loading..." : `No Friends`}
        </div>
      )}
    </div>
  );
};

export default FriendList;
