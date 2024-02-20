import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChatContext } from "stream-chat-react";

import { CustomAvatar, CustomSearchInput } from "../../custom";

import chatService from "../../../services/chatService";
import socialService from "../../../services/social";
import useDebounce from "../../../hooks/useDebounce";
import { setUpdateTimestamp } from "../../../redux/chatSlice";

import { ReactComponent as CloseIcon } from "../../../assets/images/icon-new-close.svg";
import { ReactComponent as AddMemberLogo } from "../../../assets/images/icon-singleChat.svg";
import { ReactComponent as CheckSentIcon } from "../../../assets/images-v2/check-sent-icon.svg";
import { validateEmail } from "../../../configs";
import Toast from "../../custom/CustomToast";
import { googleAnalyticsActions } from "../../../utils/googleAnalyticsInit";
import { TRACKING_ID } from "../../../utils/globalConstant";

const AddMembersModal = ({ handleClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const { client, channel } = useChatContext();
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  const channelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

  const dispatch = useDispatch();

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
      Toast.error("error", error.response.data.message);

      setSearchList([]);
    }
  };

  const handleUserSearch = (user) => {
    setSearchQuery(user);
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleSubmit = async () => {
    try {
      if (channel?.type === "messaging") {
        const updatedChannelName = members
          .map((member) => member?.user?.name)
          .join(", ");
        const payload = {
          channelName: updatedChannelName,
          userEmails: [...selectedUsers.map((user) => user.email)],
        };
        const response = await chatService.createGroup(payload);
      } else {
        const payload = {
          channelId: channel?.id,
          userEmails: [...selectedUsers.map((user) => user.email)],
        };
        const response = await chatService.addMemberToGroup(payload);
      }
      dispatch(setUpdateTimestamp(new Date().getTime()));
      Toast.success("Members Added", "Members were added successfully!");
      googleAnalyticsActions.initGoogleAnalytics(
        TRACKING_ID,
        "Added Friend",
        "Successful"
      );
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }

    handleClose();
  };

  const isValid = () => {
    return selectedUsers.length;
  };

  const isAlreadyAMember = (user) => {
    return (channel?.state?.members || {})[user?.id];
  };

  return (
    <div className="add-members-modal__container">
      <div className="add-members-inner-container">
        <header>
          <CloseIcon className="amm-close-icon" onClick={handleClose} />
          <div className="logo-wrapper">
            <AddMemberLogo />
            <span>ADD TO "{channelName}"</span>
          </div>
        </header>

        <div className="amm-search-container">
          <CustomSearchInput
            onChange={handleUserSearch}
            expanded={true}
            style={{ width: "100%", height: 44 }}
          />

          <div className="amm-list-container">
            <div className="amm-list-header">MEMBERS</div>
            <div className="amm-list-wrapper">
              {searchList.map((user, index) => (
                <div key={index} className="list-item">
                  <div className="user-name-details">
                    <CustomAvatar name={user.nickname} image={user.profileImage} size={36} />
                    <span className="user-name">{user.nickname}</span>
                  </div>

                  {isAlreadyAMember(user) ? (
                    <div className="added-wrapper">
                      <span className="added-text">Added</span>
                      <CheckSentIcon />
                    </div>
                  ) : (
                    <div
                      className="add-icon"
                      onClick={() => handleSelectUser(user)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="amm-footer">
          <button
            className="amm-submit-btn"
            disabled={isValid() ? false : true}
            onClick={handleSubmit}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
