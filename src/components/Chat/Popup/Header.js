import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChatContext } from "stream-chat-react";
import { Tooltip, Popover } from "antd";

import { GroupOptions } from "../Group";
import { CustomAvatar, ClickableIcon, CustomSearchInput } from "../../custom";

import { ReactComponent as ChatIcon } from "../../../assets/images/icon-chat.svg";
import { ReactComponent as CloseIcon } from "../../../assets/images/icon-new-close.svg";

import { ReactComponent as GroupChat } from "../../../assets/images/icon-groupChat.svg";
import { ReactComponent as SingleChat } from "../../../assets/images/icon-singleChat.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/images-v2/expand.svg";
import { ReactComponent as AddIcon } from "../../../assets/images-v2/add-icon.svg";
import { ReactComponent as LeftArrowIcon } from "../../../assets/images-v2/arrow-left-icon.svg";
import { ReactComponent as SearchIcon } from "../../../assets/images-v2/search.svg";

import FriendList from "../FriendList";
import { setIsDM } from "src/redux/chatSlice";
//chat_right_arrow

const Menu = ({
  handleHide,
  handleCreateGroupClick,
  handleCreateChatClick,
}) => {
  return (
    <div className="menu__container">
      <div
        className="menu"
        onClick={() => {
          handleCreateChatClick();
          handleHide();
        }}
      >
        New Chat
      </div>
      <div
        className="menu"
        onClick={() => {
          handleCreateGroupClick();
          handleHide();
        }}
      >
        New Group Chat
      </div>
    </div>
  );
};

const NewChat = ({ handleCreateGroupClick, handleCreateChatClick }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const handleHidePopover = () => {
    setIsPopoverVisible(false);
  };

  const handleVisibleChange = (visible) => {
    setIsPopoverVisible(visible);
  };

  return (
    <Popover
      placement="bottomRight"
      visible={isPopoverVisible}
      onVisibleChange={handleVisibleChange}
      content={
        <Menu
          handleHide={handleHidePopover}
          handleCreateGroupClick={handleCreateGroupClick}
          handleCreateChatClick={handleCreateChatClick}
        />
      }
      trigger="click"
    >
      <AddIcon className="add-icon cursor-pointer" />
    </Popover>
  );
};

export default function Header(props) {
  const [showFriendList, setShowFriendList] = useState(false);
  const { client, channel } = useChatContext();
  const { updateTimestamp } = useSelector((state) => state.chat);
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  const dispatch = useDispatch()

  const channelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

  const handleCreateGroupClick = () => {
    props.handleCreateGroupClick();
    props.setEditGroupMode(false);
  };

  const handleEditGroupClick = () => {
    props.handleCreateGroupClick();
    props.setEditGroupMode(true);
  };

  const handleCreateChatClick = () => {
    props.handleNewChatClick(true);
  };

  const toggleShowFriendList = () => {
    setShowFriendList(!showFriendList);
  };

  const getOnlineUserCount = () => {
    const totalMembers = Object.values(channel?.state?.members || {});
    const onlineMembers = totalMembers?.filter(
      (member) => member?.user?.online
    );

    return `${onlineMembers?.length} of ${totalMembers?.length} Online`;
  };

  const renderListViewHeader = () => {
    return (
      <div className="ch-sider">
        <div className="ch-logo-wrapper">
          <ChatIcon className="ch-chat-icon" />
          <span className="ch-chat-txt">Chat</span>
        </div>
        <NewChat
          handleCreateGroupClick={handleCreateGroupClick}
          handleCreateChatClick={handleCreateChatClick}
        />
      </div>
    );
  };

  const handleBackClick = () => {
    props.handleBackClick();
    setShowFriendList(false);
    dispatch(setIsDM(false))
  };

  const renderContentViewHeader = () => {
    return (
      <div className="ch-chat-details-wrapper">
        <div className="ch-chat-name-options">
          <LeftArrowIcon className="back-icon" onClick={handleBackClick} />
          <CustomAvatar name={channelName} size={36} image={channel.type === 'messaging' ? members[0]?.user?.profileImage : ''} />
          <div className="ch-chat-name-wrapper">
            <span
              key={`${updateTimestamp}-channel-name-popup`}
              className="channel-name"
            >
              {channelName}
            </span>
            {channel?.type === "team" ? (
              <div className="online-count">{getOnlineUserCount()}</div>
            ) : (
              <>
                {/* {channelName && (
                  <div className="clan-details">
                    <img
                      src={StrangeClanIcon}
                      alt="strange-clan"
                      className="clan-icon"
                    />
                    <span className="clan-name">Strange Clan</span>
                  </div>
                )} */}
              </>
            )}
          </div>
          <GroupOptions 
            handleEditGroupClick={handleEditGroupClick} 
            actionType={props.actionType}
            setActionType={props.setActionType}
            showConfirmModal={props.showConfirmModal}
            setShowConfirmModal={props.setShowConfirmModal}
          />
        </div>
        <div className="new-chats-wrapper">
          {channel?.type === "team" && (
            <ClickableIcon
              icon={<SingleChat onClick={props.handleAddMemberClick} />}
            />
          )}
          {channel?.type === "team" && (
            <ClickableIcon
              icon={<GroupChat onClick={toggleShowFriendList} />}
            />
          )}
        </div>
      </div>
    );
  };

  const renderCreateNewChatHeader = () => {
    return (
      <div className="popup__search-user-container">
        <CustomSearchInput
          onChange={props.handleUserSearch}
          expanded={true}
          style={{ width: "100%", height: 44 }}
          prefix={<SearchIcon className="cursor-pointer" />}
          suffix={
            <CloseIcon
              className="cursor-pointer"
              style={{ width: 8, height: 8 }}
              onClick={() => {
                props.setViewMode(props.VIEW_MODES.CHANNEL_LIST);
              }}
            />
          }
        />
      </div>
    );
  };

  return (
    <div className="popup-chat__header">
      <div className="ch-window-ctrl">
        <Tooltip title="Expand">
          <ExpandIcon
            className="cursor-pointer"
            onClick={props.handleMaximize}
          />
        </Tooltip>
        <Tooltip className="cursor-pointer" title="Close">
          <CloseIcon onClick={props.onExitMassagesClick} />
        </Tooltip>
      </div>
      {!props.isLoading && <>
        {props.viewMode === props.VIEW_MODES.CHANNEL_LIST &&
          renderListViewHeader()}
        {props.viewMode === props.VIEW_MODES.CHANNEL_CONTENT &&
          renderContentViewHeader()}
        {props.viewMode === props.VIEW_MODES.CREATE_NEW_CHAT &&
          renderCreateNewChatHeader()}
        {showFriendList && channel?.type === "team" && (
          <FriendList friendList={members} style={{ top: 76, right: 0 }} />
        )}
      </>}
    </div>
  );
}
