import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react";
import { Divider, Popover } from "antd";

import CreateGroupModal from './CreateGroupModal';
import { validateEmail } from "../../../configs";
import socialService from "../../../services/social";
import useDebounce from "../../../hooks/useDebounce";

import { CustomAvatar } from '../../custom';
import { getSecretKey } from '../utils';

import { ReactComponent as SearchIcon } from "../../../assets/images/icon-search.svg";

import "./index.scss"
import { CustomInput } from '../../custom';

const SearchResult = ({ list, handleUserClick }) => {
  return (
    <div className="search-user-result__container">
      <div className="list-container">
        {list.map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="result-wrapper cursor-pointer" onClick={() => handleUserClick(user)}>
              <div className="left">
                <div className="user-icon-wrapper">
                  <CustomAvatar size={48} image={user.profileImage}/>
                </div>
                <div className="user-detail-wrapper">
                  <span className="username-text">{user.nickname}</span>
                  <span className="user-place-text">{user.email}</span>
                </div>
              </div>
            </div>
            {index < list.length - 1 && <Divider className='divider' />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const NewGroupPopup = () => {
  const { client, setActiveChannel } = useChatContext();
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);

  const account = useSelector((state) => state.account);

  useEffect(() => {
    setShowSearchResult(!!searchList.length);
  }, [searchList]);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

  const fetchSearchResult = async () => {
    try {
      const payload = {}
      if (validateEmail(debouncedSearchText)) {
        payload.email = debouncedSearchText
      } else {
        payload.nickname = debouncedSearchText
      }
      const response = await socialService.searchUser(payload);

      let filteredList = response?.data?.users?.filter((user) => user.id !== account.id) || [];

      setSearchList(filteredList);
    } catch (error) {
      console.log(error);
      setSearchList([]);
    }
  };

  const handleOutsideClick = () => {
    setShowSearchResult(false);
  };

  const handleCreateModalShow = () => {
    setShowCreateModal(true)
  }

  const handleCreateModalClose = () => {
    setShowCreateModal(false)
  }

  const handleSearchInput = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleUserClick = async (user) => {
    createChannel(user)
  }

  const createChannel = async (user) => {
    const userId = user?.id;
    try {
      const secretKey = await getSecretKey()
      const response = await client.queryUsers(
        { id: { $ne: client.userID } },
        { id: 1 },
        { limit: 8 }
      );
      
      const newChannel = await client.channel(
        "messaging",
        "",
        {
          name: "",
          members: [client.userID, userId],
        },
        secretKey
      );

      await newChannel.watch();
      setActiveChannel(newChannel);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='new-group-popup__container'>
        <div className='input-wrapper'>
          <Popover 
            placement="bottom"
            visible={showSearchResult}
            onVisibleChange={handleOutsideClick}
            content={
              <SearchResult list={searchList} handleUserClick={handleUserClick}/>
            }
            trigger="click"
          >
            <CustomInput
              placeHolder="Search Person or Channel"
              prefix={<SearchIcon style={{ width: 16 }} />}
              height={44}
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </Popover>
        </div>

        <div className='create-group-action' onClick={handleCreateModalShow}>
          <span className='plus-icon'>+</span> <span>Create New Group</span>
        </div>
      </div>
      {showCreateModal && <CreateGroupModal handleClose={handleCreateModalClose} />}
    </>
  )
}

export default NewGroupPopup