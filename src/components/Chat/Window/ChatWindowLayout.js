import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { useChatContext } from "stream-chat-react";
import Header from "./Header";
import AddMembersModal from "../Group/AddMembersModal";
import CreateGroupModal from "../Group/CreateGroupModal";
import ChannelListContainer from "./ChannelListContainer";
import ChannelContainer from "./ChannelContainer";
import "../index.scss"
import FriendList from '../FriendList'
import CreateNewChat from '../Group/CreateNewChat';

const ChatWindowLayout = ({
  onExitMassagesClick,
  handleMinimize,
  setIsLoading,
  actionType, 
  setActionType, 
  showConfirmModal, 
  setShowConfirmModal,
  isLoading
}) => {
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [editGroupMode, setEditGroupMode] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false)
  const { client, channel, setActiveChannel } = useChatContext();

  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  /* reset friendlist view while changing the channel. */
  useEffect(() => {
    setShowFriendList(false)
  }, [channel])

  return (
    <div className="chat__container">
      <div className="outer-container">
        <div className="inner-container">
          <div className="chat__window-layout">
            <Header
              onExitMassagesClick={onExitMassagesClick}
              handleMinimize={handleMinimize}
              handleAddMemberClick={() => setShowAddMembersModal(true)}
              handleCreateGroupClick={() => setShowCreateGroupModal(true)}
              setEditGroupMode={setEditGroupMode}
              setShowFriendList={setShowFriendList}
              setShowCreateChatModal={setShowCreateChatModal}
              showFriendList={showFriendList}
              actionType={actionType}
              setActionType={setActionType}
              showConfirmModal={showConfirmModal}
              setShowConfirmModal={setShowConfirmModal}
            />
            <div className="chat_content">
              <ChannelListContainer isLoading={isLoading} />
              <ChannelContainer isLoading={isLoading} />
            </div>
            {showAddMembersModal && (
              <AddMembersModal handleClose={() => setShowAddMembersModal(false)} />
            )}
            {showCreateGroupModal && (
              <CreateGroupModal
                editMode={editGroupMode}
                handleClose={() => setShowCreateGroupModal(false)}
              />
            )}
            {showCreateChatModal && (
              <CreateNewChat 
                handleClose={() => setShowCreateChatModal(false)}
              />
            )}
            {showFriendList && channel?.type === "team" && (
              <FriendList friendList={members} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowLayout;
