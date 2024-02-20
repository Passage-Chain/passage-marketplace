import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react";
import Header from "./Header";
import ChannelListContainer from "./ChannelListContainer";
import ChannelContainer from "./ChannelContainer";
import useDebounce from "../../../hooks/useDebounce";
import { validateEmail } from "../../../configs";
import socialService from "../../../services/social";
import SearchResult from "./SearchResult";
import CreateGroupModal from "../Group/CreateGroupModal";
import AddMembersModal from "../Group/AddMembersModal";

import "./index.scss";

const VIEW_MODES = {
  CHANNEL_LIST: "CHANNEL_LIST",
  CHANNEL_CONTENT: "CHANNEL_CONTENT",
  CREATE_NEW_CHAT: "CREATE_NEW_CHAT",
};

const Popup = ({ 
  onExitMassagesClick, 
  handleMaximize, 
  actionType, 
  setActionType, 
  showConfirmModal, 
  setShowConfirmModal,
  isDM,
  isLoading
}) => {
  const [viewMode, setViewMode] = useState();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const [editGroupMode, setEditGroupMode] = useState(false);
  const { client } = useChatContext();

  const account = useSelector((state) => state.account);

  useEffect(() => {
      setViewMode(isDM ? VIEW_MODES.CHANNEL_CONTENT : VIEW_MODES.CHANNEL_LIST)
  }, [isDM])

  useEffect(() => {
    setSearchList([]);
    setSearchQuery("");
  }, [viewMode]);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

  const handleNewChatClick = () => {
    setViewMode(VIEW_MODES.CREATE_NEW_CHAT);
  };

  const handleUserSearch = (user) => {
    setSearchQuery(user);
  };

  const fetchSearchResult = async () => {
    try {
      const payload = {};
      if (validateEmail(debouncedSearchText)) {
        payload.email = debouncedSearchText;
      } else {
        payload.nickname = debouncedSearchText;
      }
      const response = await socialService.searchUser(payload);

      let filteredList =
        response?.data?.users?.filter((user) => user.id !== account.id) || [];

      setSearchList(filteredList);
    } catch (error) {
      console.log(error);
      setSearchList([]);
    }
  };

  return (
    <>
      <div className="popup-chat__container">
        <div className="main-wrapper">
          <Header
            onExitMassagesClick={onExitMassagesClick}
            handleMaximize={handleMaximize}
            viewMode={viewMode}
            VIEW_MODES={VIEW_MODES}
            handleBackClick={() => setViewMode(VIEW_MODES.CHANNEL_LIST)}
            handleCreateGroupClick={() => setShowCreateGroupModal(true)}
            handleNewChatClick={handleNewChatClick}
            handleUserSearch={handleUserSearch}
            setViewMode={setViewMode}
            setEditGroupMode={setEditGroupMode}
            handleAddMemberClick={() => setShowAddMembersModal(true)}
            actionType={actionType}
            setActionType={setActionType}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            isLoading={isLoading}
          />
          <div className="popup-chat__inner-container">
            {viewMode === VIEW_MODES.CHANNEL_LIST && (
              <ChannelListContainer
                handlePreviewClick={() => {
                  setViewMode(VIEW_MODES.CHANNEL_CONTENT);
                }}
                isLoading={isLoading}
              />
            )}
            {viewMode === VIEW_MODES.CHANNEL_CONTENT && <ChannelContainer isLoading={isLoading}/>}
            {viewMode === VIEW_MODES.CREATE_NEW_CHAT && (
              <SearchResult
                searchList={searchList}
                setViewMode={setViewMode}
                VIEW_MODES={VIEW_MODES}
              />
            )}
          </div>
        </div>
      </div>
      {showCreateGroupModal && (
        <CreateGroupModal
          editMode={editGroupMode}
          handleClose={() => setShowCreateGroupModal(false)}
          client={client}
        />
      )}
      {showAddMembersModal && (
        <AddMembersModal handleClose={() => setShowAddMembersModal(false)} />
      )}
    </>
  );
};

export default Popup;
