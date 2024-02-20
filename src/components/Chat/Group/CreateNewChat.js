import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChatContext } from "stream-chat-react";

import {
  CustomAvatar,
  CustomSearchInput,
} from "../../custom";
import socialService from "../../../services/social";
import useDebounce from "../../../hooks/useDebounce";
import { getSecretKey } from "../utils";

import { ReactComponent as CloseIcon } from "../../../assets/images/icon-new-close.svg";
import { ReactComponent as AddMemberLogo } from "../../../assets/images/icon-singleChat.svg";
import { validateEmail } from "../../../configs";

const CreateNewChat = ({ handleClose }) => {
  const [searchList, setSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const { client, channel, setActiveChannel } = useChatContext();
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

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
      console.log(error)
      setSearchList([]);
    }
  };

  const handleUserSearch = (user) => {
    setSearchQuery(user);
  };

  const createChannel = async (user) => {
    try {
      const secretKey = await getSecretKey();
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
          members: [client.userID, user?.id],
        },
        secretKey
      );

      await newChannel.watch();
      setActiveChannel(newChannel);
      handleClose()
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="add-members-modal__container">
      <div className="add-members-inner-container">
        <header>
          <CloseIcon className="amm-close-icon" onClick={handleClose} />
          <div className="logo-wrapper">
            <AddMemberLogo />
            <span>Start New Chat</span>
          </div>
        </header>

        <div className="amm-search-container">
          <CustomSearchInput
            onChange={handleUserSearch}
            expanded={true}
            style={{ width: "100%", height: 44 }}
          />

          <div className="amm-list-container">
            {searchList.length ? <div className="amm-list-header">RESULT</div> : ''}
            <div className="amm-list-wrapper">
              {searchList.map((user, index) => (
                <div key={index} className="list-item">
                  <div className="user-name-details">
                    <CustomAvatar name={user.nickname} image={user.profileImage} size={36} />
                    <span className="user-name">{user.nickname}</span>
                  </div>

                  <div
                    className="add-icon"
                    onClick={() => createChannel(user)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="amm-footer">
          <button
            className="amm-submit-btn"
            disabled={isValid() ? false : true}
            onClick={handleSubmit}
          >
            Save changes
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CreateNewChat;
