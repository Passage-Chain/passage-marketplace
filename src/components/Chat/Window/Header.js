import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react";
import { CustomAvatar, ClickableIcon } from "../../custom";
import { Tooltip, Popover } from "antd";
import { ReactComponent as ChatIcon } from "../../../assets/images/icon-chat.svg";
import { ReactComponent as CloseIcon } from "../../../assets/images/icon-new-close.svg";

import { ReactComponent as Collaps } from "../../../assets/images/icon-collaps.svg";
import { ReactComponent as GroupChat } from "../../../assets/images/icon-groupChat.svg";
import { ReactComponent as SingleChat } from "../../../assets/images/icon-singleChat.svg";

import { ReactComponent as AddIcon } from "../../../assets/images-v2/add-icon.svg";
import { GroupOptions } from "../Group";

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
  const { client, channel } = useChatContext();
  const { updateTimestamp } = useSelector((state) => state.chat);
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  const channelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

  const handleEditGroupClick = () => {
    props.handleCreateGroupClick();
    props.setEditGroupMode(true);
  };

  const handleCreateGroupClick = () => {
    props.handleCreateGroupClick();
    props.setEditGroupMode(false);
  };

  const handleCreateChatClick = () => {
    props.setShowCreateChatModal(true);
  };

  const toggleShowFriendList = () => {
    props.setShowFriendList(!props.showFriendList);
  };

  const getOnlineUserCount = () => {
    const totalMembers = Object.values(channel?.state?.members || {});
    const onlineMembers = totalMembers?.filter(
      (member) => member?.user?.online
    );

    return `${onlineMembers?.length} of ${totalMembers?.length} Online`;
  };

  return (
    <div className="chat__header">
      <div className="ch-window-ctrl">
        <Tooltip title="Collapse">
          <Collaps className="cursor-pointer" onClick={props.handleMinimize} />
        </Tooltip>
        <Tooltip className="cursor-pointer" title="Close">
          <CloseIcon onClick={props.onExitMassagesClick} />
        </Tooltip>
      </div>
      <div className="ch-chat-options-row">
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
        {channelName && (
          <div className="ch-chat-details-wrapper">
            <div className="ch-chat-name-options">
              <CustomAvatar name={channelName} size={36} image={channel.type === 'messaging' ? members[0]?.user?.profileImage : ''} />
              <div className="ch-chat-name-wrapper">
                <span
                  key={`${updateTimestamp}-channel-name`}
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
        )}
      </div>
    </div>
  );
}
